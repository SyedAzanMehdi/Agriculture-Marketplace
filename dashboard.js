// ============================================================
// AgriConnect – Dashboard & Resource Components
// ============================================================

/**
 * Main dashboard router component. Routes dashboard layout based on the user's role.
 */
function renderDashboard() {
  if (!state.user) {
    navigate('login');
    return '';
  }

  const role = state.user.role;
  if (role === 'farmer') return renderFarmerDashboard();
  if (role === 'buyer') return renderBuyerDashboard();
  if (role === 'admin') return renderAdminDashboard();

  // Fallback
  return renderFarmerDashboard();
}

/**
 * Reusable layout for the sidebar menu panel.
 * @param {Array} items - Collection of tab objects indicating specific menu actions
 */
function renderSidebar(items) {
  return `
  <aside class="sidebar">
    <div class="sidebar-inner">
      <div class="sidebar-user-card">
        <div class="user-avatar">${state.user.name.charAt(0).toUpperCase()}</div>
        <div class="user-details">
          <div class="u-name">${state.user.name}</div>
          <div class="u-role">${state.user.role} • ${state.user.location}</div>
        </div>
      </div>
      
      <div class="sidebar-nav">
        <div class="sidebar-label">Main Menu</div>
        <div class="sidebar-menu">
          ${items.map(i => `
          <div class="sidebar-item ${state.sidebarTab === i.key ? 'active' : ''}" onclick="navigate('dashboard',{tab:'${i.key}'})">
            ${i.icon ? `<span class="s-icon">${i.icon}</span>` : ''}
            <span class="s-label">${i.label}</span>
          </div>`).join('')}
          <div class="sidebar-item" onclick="navigate('marketplace')">
            <span class="s-label">Marketplace</span>
          </div>
        </div>
      </div>
      
      <div class="sidebar-footer">
        <div class="sidebar-item" onclick="logout()">
          <span class="s-label">Sign Out</span>
        </div>
      </div>
    </div>
  </aside>`;
}

// ==================== FARMER DASHBOARD ====================
/**
 * Assembles all views distinct to a Farmer Role
 */
function renderFarmerDashboard() {
  const tabs = [
    { key: 'overview', label: t('dash_overview') },
    { key: 'listings', label: t('dash_listings') },
    { key: 'offers', label: t('dash_offers') },
    { key: 'addcrop', label: t('dash_add') },
  ];

  let content = '';
  const myCrops = state.crops.filter(c => c.farmerId === state.user.id);
  const myOffers = state.offers.filter(o => myCrops.some(c => c.id === o.cropId));

  if (state.sidebarTab === 'overview') {
    const totalValue = myCrops.reduce((s, c) => s + c.price * c.quantity, 0);
    const accepted = myOffers.filter(o => o.status === 'accepted').length;
    const pending = myOffers.filter(o => o.status === 'pending').length;
    const rejected = myOffers.filter(o => o.status === 'rejected').length;

    // Revenue projection by crop
    const revenueData = {};
    myCrops.forEach(c => {
      revenueData[c.name] = (revenueData[c.name] || 0) + (c.price * c.quantity);
    });

    const revLabels = Object.keys(revenueData).length ? Object.keys(revenueData) : ['No Listed Crops'];
    const revValues = Object.values(revenueData).length ? Object.values(revenueData) : [0];

    setTimeout(() => {
      // Asset Valuation Bar Chart
      const ctxRev = document.getElementById('revenueChart');
      if (ctxRev && window.Chart) {
        if (window.farmerRevChart) window.farmerRevChart.destroy();
        window.farmerRevChart = new Chart(ctxRev, {
          type: 'bar',
          data: {
            labels: revLabels,
            datasets: [{
              label: 'Projected Value (Rs)',
              data: revValues,
              backgroundColor: 'rgba(56, 189, 140, 0.7)',
              borderColor: '#38bd8c',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } }
            }
          }
        });
      }

      // Offers Breakdown Doughnut Chart
      const ctxOffers = document.getElementById('farmerOffersChart');
      if (ctxOffers && window.Chart) {
        if (window.farmerOffersChartInstance) window.farmerOffersChartInstance.destroy();

        const hasOffers = accepted > 0 || pending > 0 || rejected > 0;

        window.farmerOffersChartInstance = new Chart(ctxOffers, {
          type: 'doughnut',
          data: {
            labels: hasOffers ? ['Accepted', 'Pending', 'Rejected'] : ['No Offers Yet'],
            datasets: [{
              data: hasOffers ? [accepted, pending, rejected] : [1],
              backgroundColor: hasOffers ? ['#10b981', '#f59e0b', '#ef4444'] : ['#e5e7eb'],
              borderWidth: 0,
              hoverOffset: hasOffers ? 4 : 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
              legend: { position: 'bottom' },
              tooltip: { enabled: hasOffers }
            }
          }
        });
      }
    }, 50);

    content = `
      <style>
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-stagger-1 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .anim-stagger-2 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
        .anim-stagger-3 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
        .anim-stagger-4 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
        .anim-stagger-5 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both; }
      </style>
      <div class="dash-header anim-stagger-1">
        <div><h1>${t('dash_overview')}</h1><p>${t('dash_welcome')}, ${state.user.name}!</p></div>
      </div>
      <div class="dash-stats">
        <div class="dash-stat-card anim-stagger-1"><div class="stat-label">${t('dash_stats_active')}</div><div class="stat-main"><div class="stat-value">${myCrops.length}</div><div class="stat-icon">LS</div></div></div>
        <div class="dash-stat-card anim-stagger-2"><div class="stat-label">${t('dash_stats_offers')}</div><div class="stat-main"><div class="stat-value">${myOffers.length}</div><div class="stat-icon">OF</div></div></div>
        <div class="dash-stat-card anim-stagger-3"><div class="stat-label">${t('dash_stats_value')}</div><div class="stat-main"><div class="stat-value">Rs. ${totalValue.toLocaleString()}</div><div class="stat-icon">PK</div></div></div>
      </div>
      
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;" class="anim-stagger-5">
        <div class="dash-table-card" style="padding: 20px;">
          <h3>Asset Valuation Projection</h3>
          <div style="position: relative; height: 220px; width: 100%; margin-top: 16px;">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>
        <div class="dash-table-card" style="padding: 20px;">
          <h3>Offers Breakdown</h3>
          <div style="position: relative; height: 220px; width: 100%; margin-top: 16px;">
            <canvas id="farmerOffersChart"></canvas>
          </div>
        </div>
      </div>

      <div class="dash-table-card anim-stagger-5">
        <div class="dash-table-header"><h3>Recent Offers</h3></div>
        <table class="dash-table">
          <thead><tr><th>Crop</th><th>Buyer</th><th>Offered Price</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
          ${myOffers.slice(0, 5).map(o => {
      const crop = state.crops.find(c => c.id === o.cropId);
      const buyer = window.USERS_DATA.find(u => u.id === o.buyerId);
      return `
            <tr>
              <td>${crop?.name || '---'}</td>
              <td>${buyer?.name || '---'}</td>
              <td>Rs. ${o.offeredPrice}/unit</td>
              <td><span class="status-badge ${o.status}">${o.status}</span></td>
              <td>${o.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="handleOffer(${o.id},'accepted')">Accept</button> <button class="btn btn-ghost btn-sm" onclick="handleOffer(${o.id},'rejected')">Reject</button>` : '---'}</td>
            </tr>`;
    }).join('')}
          </tbody>
        </table>
      </div>`;

  } else if (state.sidebarTab === 'listings') {
    content = `
      <div class="dash-header">
        <div><h1>My Crop Listings</h1><p>Manage all your listed crops currently available</p></div>
        <div class="dash-header-actions"><button class="btn btn-primary" onclick="navigate('dashboard',{tab:'addcrop'})">Add New Crop</button></div>
      </div>
      <div class="dash-table-card">
        <table class="dash-table">
          <thead><tr><th>Crop Segment</th><th>Category</th><th>Qty</th><th>Expected Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
          ${myCrops.map(c => {
      const isStale = c.status === 'available' && isOld(c.listedDate, 14);
      return `
            <tr>
              <td><strong>${c.name}</strong> ${isStale ? '<span class="status-badge badge-old" style="margin-left:8px;font-size:0.7rem">Stale</span>' : ''}</td>
              <td>${c.category}</td>
              <td>${c.quantity} ${c.unit}</td>
              <td>Rs. ${c.price}/${c.unit}</td>
              <td><span class="status-badge ${c.status}">${c.status}</span></td>
              <td><button class="btn btn-danger btn-sm" onclick="deleteCrop(${c.id})">Delete</button></td>
            </tr>`;
    }).join('')}
          </tbody>
        </table>
      </div>`;

  } else if (state.sidebarTab === 'offers') {
    content = `
      <div class="dash-header"><div><h1>Offers Received Pipeline</h1><p>Review and act upon inbound market requests</p></div></div>
      <div class="dash-table-card">
        <table class="dash-table">
          <thead><tr><th>Crop Context</th><th>Buyer Entity</th><th>Proposal</th><th>Message</th><th>Current Status</th><th>Action Required</th></tr></thead>
          <tbody>
          ${myOffers.map(o => {
      const crop = state.crops.find(c => c.id === o.cropId);
      const bUser = window.USERS_DATA.find(u => u.id === o.buyerId);
      return `
            <tr>
              <td>${crop?.name || '---'}</td>
              <td>${bUser?.name || '---'}</td>
              <td>Rs. ${o.offeredPrice}</td>
              <td style="max-width:200px;font-size:.82rem;color:var(--gray-500)">${o.message || '---'}</td>
              <td><span class="status-badge ${o.status}">${o.status}</span></td>
              <td>${o.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="handleOffer(${o.id},'accepted')">Accept</button> <button class="btn btn-ghost btn-sm" onclick="handleOffer(${o.id},'rejected')">Reject</button>` : '---'}</td>
            </tr>`;
    }).join('')}
          </tbody>
        </table>
      </div>`;

  } else if (state.sidebarTab === 'addcrop') {
    content = `
      <div class="dash-header"><div><h1>Add New Crop Listing</h1><p>List your crop on the marketplace by filling out the details below</p></div></div>
      <div style="max-width:720px">
        <div style="background:var(--bg-surface);border-radius:var(--radius-lg);border:1.5px solid var(--gray-100);padding:32px">
          <form onsubmit="handleAddCrop(event)" autocomplete="off">
            <div class="form-group">
              <label>Crop Name</label>
              <input class="form-input" id="cropName" placeholder="e.g. Wheat, Tomato, Mango..." required>
            </div>

            <div class="form-group">
              <label>Category</label>
              <select class="form-select" id="cropCat" required>
                <option value="">Select category...</option>
                <option>Grain</option><option>Cash Crop</option><option>Fruit</option><option>Vegetable</option>
              </select>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group"><label>Quantity Available</label><input class="form-input" type="number" id="cropQty" placeholder="e.g. 500" min="1" required></div>
              <div class="form-group"><label>Unit</label><select class="form-select" id="cropUnit"><option>kg</option><option>ton</option><option>maund</option></select></div>
            </div>

            <div class="form-group"><label>Expected Price per Unit (Rs.)</label><input class="form-input" type="number" id="cropPrice" placeholder="e.g. 95" min="1" required></div>
            <div class="form-group"><label>Location</label><input class="form-input" id="cropLocation" placeholder="City / Village" value="${state.user.location}" required></div>
            
            <div style="border-top:1.5px dashed var(--gray-200);margin:24px 0;padding-top:20px">
              <h3 style="font-size:1.1rem;margin-bottom:16px;color:var(--text-primary)">Farmer Contact Information</h3>
              <div class="form-group">
                <label>Farmer Name</label>
                <input class="form-input" id="farmerName" placeholder="Your name" value="${state.user.name}" required>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
                <div class="form-group">
                  <label>City</label>
                  <input class="form-input" id="farmerCity" placeholder="Your city" value="${state.user.location}" required>
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input class="form-input" id="farmerPhone" placeholder="Your contact number" value="${state.user.phone}" required>
                </div>
              </div>
            </div>

            <div class="form-group"><label>Description / Quality Notes</label><textarea class="form-input" id="cropDesc" rows="3" placeholder="Describe quality, grade, or harvest details..."></textarea></div>
            <button class="btn btn-primary" type="submit" style="width:100%">List Crop on Marketplace</button>
          </form>
        </div>
      </div>`;
  } else if (state.sidebarTab === 'browse') {
    navigate('marketplace');
    return '';
  }

  return `${renderNavbar()}<div class="dashboard">${renderSidebar(tabs)}<div class="main-content page-transition-enter">${content}</div></div>`;
}

// ==================== REGIONAL ANALYSIS PAGE ====================
/**
 * Standalone page for regional analysis (Public & Private)
 */
function renderRegionalAnalysisPage() {
  const regions = [...new Set(state.regional_stats.map(s => s.region))];
  const selectedRegion = state.selectedRegion || regions[0] || 'Loading...';
  const regionStats = state.regional_stats.filter(s => s.region === selectedRegion);

  const content = `
    <div class="container section">
      <div class="marquee-wrapper-outer">
        ${renderMarquee([
    { en: 'Weather advisory: Light rain is expected in the Mianwali region next week. Farmers should plan harvesting accordingly.', ur: 'موسم کی ایڈوائزری: اگلے ہفتے میانوالی کے علاقے میں ہلکی بارش کا امکان ہے۔ کسان کٹائی کی منصوبہ بندی اسی کے مطابق کریں۔' },
    { en: 'The soil quality report for the Piplan region has been updated for May 2024.', ur: 'پپلاں ریجن کے لیے مٹی کے معیار کی رپورٹ مئی 2024 کے لیے اپ ڈیٹ کر دی گئی ہے۔' },
    { en: 'The harvesting peak for the current wheat crop is predicted for late May.', ur: 'گندم کی موجودہ فصل کی کٹائی کا عروج مئی کے آخر میں متوقع ہے۔' }
  ])}
      </div>
      <div class="dash-header">
        <div>
          <h1>${t('region_title')}</h1>
          <p>${t('region_subtitle')}</p>
        </div>
      </div>

      <div class="regional-container">
        <div class="regional-selector-card">
          <div class="form-group">
            <label>Select Analysis Region</label>
            <select class="form-select" onchange="updateRegion(this.value)">
              ${regions.length > 0 ? regions.map(r => `<option ${r === selectedRegion ? 'selected' : ''}>${r}</option>`).join('') : '<option>No data available</option>'}
            </select>
          </div>
        </div>

        ${regions.length > 0 ? `
        <div class="regional-grid">
          <div class="stats-card">
            <h3>Top Crops for ${selectedRegion}</h3>
            <div class="top-crops-list">
              ${regionStats.sort((a, b) => b.demand_level - a.demand_level).map(s => `
                <div class="top-crop-item">
                  <div class="crop-info">
                    <span class="crop-emoji">${getCropEmoji(s.crop_name)}</span>
                    <div>
                      <div class="crop-name">${s.crop_name}</div>
                      <div class="crop-demand">Demand: ${s.demand_level}%</div>
                    </div>
                  </div>
                  <div class="crop-yield">
                    <strong>${s.avg_yield}</strong>
                    <span>units/acre</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="charts-card">
            <h3>Price Distribution (Rs/unit)</h3>
            <div class="bar-chart">
              ${regionStats.map(s => {
    const maxPrice = Math.max(...regionStats.map(x => x.avg_price));
    const height = (s.avg_price / maxPrice) * 100;
    return `
                  <div class="chart-column">
                    <div class="bar" style="height: ${height}%" title="Rs. ${s.avg_price}">
                      <span class="bar-value">Rs.${s.avg_price}</span>
                    </div>
                    <span class="bar-label">${s.crop_label || s.crop_name}</span>
                  </div>
                `;
  }).join('')}
            </div>
          </div>
        </div>` : `
        <div class="empty-state">
          <p>Regional data is currently loading or unavailable. Please ensure the database is seeded.</p>
        </div>`}
      </div>
    </div>`;

  return `${renderNavbar()}<main class="page-transition-enter" style="padding-top:100px">${content}</main>${renderFooter ? renderFooter() : ''}`;
}

function updateRegion(region) {
  state.selectedRegion = region;
  render();
}

// ==================== GOVT SCHEMES PAGE ====================
/**
 * Standalone page for Government Schemes
 */
function renderGovtSchemesPage() {
  const schemes = state.govt_schemes || [];
  const selectedSchemeId = state.selectedSchemeId || (schemes[0]?.id);
  const selectedScheme = schemes.find(s => s.id == selectedSchemeId);

  const content = `
    <div class="container section">
      <div class="marquee-wrapper-outer">
        ${renderMarquee([
    { en: 'Kissan Card registration remains open until June 30th. Eligible farmers are encouraged to apply now.', ur: 'کسان کارڈ کی رجسٹریشن 30 جون تک کھلی ہے۔ اہل کسانوں کی حوصلہ افزائی کی جاتی ہے کہ وہ ابھی اپلائی کریں۔' },
    { en: 'Government subsidies are now available for solar tube well installations. Limited spots remain.', ur: 'سولر ٹیوب ویل کی تنصیب کے لیے سرکاری سبسڈیز دستیاب ہیں۔ محدود جگہیں باقی ہیں۔' },
    { en: 'Farmers can apply for interest-free livestock loans today at their nearest facilitation center.', ur: 'کسان آج ہی اپنے قریبی سہولیاتی مرکز پر بلاسود لائیوسٹاک قرضوں کے لیے درخواست دے سکتے ہیں۔' }
  ])}
      </div>
      <div class="dash-header">
        <div>
          <h1>${t('scheme_title')}</h1>
          <p>${t('scheme_subtitle')}</p>
        </div>
      </div>

      <div class="schemes-layout">
        <div class="schemes-selector-panel">
          <div class="form-group">
            <label>Select a Scheme to View Details</label>
            <select class="form-select scheme-main-select" onchange="updateScheme(this.value)">
              ${schemes.map(s => `<option value="${s.id}" ${s.id == selectedSchemeId ? 'selected' : ''}>${s.title}</option>`).join('')}
            </select>
          </div>
          
          <div class="schemes-quick-list">
            ${schemes.map(s => `
              <div class="scheme-list-item ${s.id == selectedSchemeId ? 'active' : ''}" onclick="updateScheme(${s.id})">
                <div class="s-dot"></div>
                <span>${s.title}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="scheme-detail-view animate-fade-in">
          ${selectedScheme ? `
            <div class="scheme-detail-card">
              <div class="scheme-badge">${selectedScheme.category}</div>
              <h2>${selectedScheme.title}</h2>
              <p class="scheme-desc">${selectedScheme.description}</p>
              
              <div class="scheme-info-grid">
                <div class="info-box">
                  <h4>Key Benefits</h4>
                  <ul>
                    ${selectedScheme.benefits.split(';').map(b => `<li>${b.trim()}</li>`).join('')}
                  </ul>
                </div>
                ${selectedScheme.eligibility ? `
                <div class="info-box">
                  <h4>Eligibility Criteria</h4>
                  <p>${selectedScheme.eligibility}</p>
                </div>` : ''}
              </div>
            </div>
          ` : `
            <div class="empty-state">
              <p>${state.lang === 'en' ? 'Select a scheme from the list to see its benefits and eligibility criteria.' : 'فوائد اور اہلیت کی تفصیلات دیکھنے کے لیے فہرست سے ایک سکیم منتخب کریں۔'}</p>
            </div>
          `}
        </div>
      </div>
    </div>`;

  return `${renderNavbar()}<main class="page-transition-enter" style="padding-top:100px">${content}</main>${renderFooter ? renderFooter() : ''}`;
}

function updateScheme(id) {
  state.selectedSchemeId = id;
  render();
}

// ==================== RESOURCE PAGES (Help, Pricing, Calendar) ====================

function renderResourcePage(type) {
  let title = '';
  let content = '';

  if (type === 'help') {
    title = t('res_help');
    content = `
            <div class="resource-card">
                <h3>${state.lang === 'en' ? 'Frequently Asked Questions' : 'عام طور پر پوچھے گئے سوالات'}</h3>
                <div class="faq-list">
                    <div class="faq-item"><strong>${state.lang === 'en' ? 'How do I sell my crop?' : 'میں اپنی فصل کیسے بیچ سکتا ہوں؟'}</strong><p>${state.lang === 'en' ? 'Register as a farmer, go to your dashboard, and click "Add Crop".' : 'بطور کسان رجسٹر ہوں، اپنے ڈیش بورڈ پر جائیں، اور "فصل شامل کریں" پر کلک کریں۔'}</p></div>
                    <div class="faq-item"><strong>${state.lang === 'en' ? 'Is there any registration fee?' : 'کیا رجسٹریشن کی کوئی فیس ہے؟'}</strong><p>${state.lang === 'en' ? 'No, AgriConnect is completely free for farmers and buyers.' : 'نہیں، ایگری کنیکٹ کسانوں اور خریداروں کے لیے بالکل مفت ہے۔'}</p></div>
                    <div class="faq-item"><strong>${state.lang === 'en' ? 'How can I contact support?' : 'میں سپورٹ سے کیسے رابطہ کر سکتا ہوں؟'}</strong><p>${state.lang === 'en' ? 'You can email us at support@agriconnect.pk or call our helpline.' : 'آپ ہمیں support@agriconnect.pk پر ای میل کر سکتے ہیں یا ہماری ہیلپ لائن پر کال کر سکتے ہیں۔'}</p></div>
                </div>
            </div>`;
  } else if (type === 'pricing') {
    title = t('res_pricing');
    content = `
            <div class="resource-card">
                <h3>${state.lang === 'en' ? 'Mianwali Market Average Prices' : 'میانوالی منڈی کی اوسط قیمتیں'}</h3>
                <table class="dash-table" style="margin-top:20px">
                    <thead><tr><th>${state.lang === 'en' ? 'Crop' : 'فصل'}</th><th>${state.lang === 'en' ? 'Price (per Maund)' : 'قیمت (فی من)'}</th><th>${state.lang === 'en' ? 'Trend' : 'رجحان'}</th></tr></thead>
                    <tbody>
                        <tr><td>Wheat (گندم)</td><td>Rs. 3,950</td><td style="color:green">↑ Stable</td></tr>
                        <tr><td>Gram (چنا)</td><td>Rs. 12,000</td><td style="color:red">↓ Decreasing</td></tr>
                        <tr><td>Cotton (کپاس)</td><td>Rs. 8,600</td><td style="color:green">↑ Increasing</td></tr>
                        <tr><td>Sugarcane (گنا)</td><td>Rs. 450</td><td style="color:gray">→ Neutral</td></tr>
                    </tbody>
                </table>
            </div>`;
  } else if (type === 'calendar') {
    title = t('res_calendar');
    content = `
            <div class="resource-card">
                <h3>${state.lang === 'en' ? 'Crop Sowing & Harvesting Seasons' : 'فصلوں کی بوائی اور کٹائی کے اوقات'}</h3>
                <div class="calendar-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px">
                    <div class="cal-item"><strong>Wheat (گندم)</strong><br>${state.lang === 'en' ? 'Sowing: Nov-Dec' : 'بوائی: نومبر-دسمبر'}<br>${state.lang === 'en' ? 'Harvest: April-May' : 'کٹائی: اپریل-مئی'}</div>
                    <div class="cal-item"><strong>Cotton (کپاس)</strong><br>${state.lang === 'en' ? 'Sowing: April-May' : 'بوائی: اپریل-مئی'}<br>${state.lang === 'en' ? 'Harvest: Oct-Nov' : 'کٹائی: اکتوبر-نومبر'}</div>
                    <div class="cal-item"><strong>Sugarcane (گنا)</strong><br>${state.lang === 'en' ? 'Sowing: Feb-March' : 'بوائی: فروری-مارچ'}<br>${state.lang === 'en' ? 'Harvest: Nov-Dec' : 'کٹائی: نومبر-دسمبر'}</div>
                    <div class="cal-item"><strong>Moong (مونگ)</strong><br>${state.lang === 'en' ? 'Sowing: June-July' : 'بوائی: جون-جولائی'}<br>${state.lang === 'en' ? 'Harvest: Sept-Oct' : 'کٹائی: ستمبر-اکتوبر'}</div>
                </div>
            </div>`;
  }

  return `${renderNavbar()}<main class="page-transition-enter" style="padding-top:120px">
        <div class="container">
            <div class="dash-header"><div><h1>${title}</h1></div></div>
            ${content}
        </div>
    </main>${renderFooter ? renderFooter() : ''}`;
}

/**
 * Renders a clean, photo-scan-only disease diagnostic page
 */
function renderDiseasesPage() {
  const lang = state.lang;

  const content = `
    <div class="container section" style="max-width: 850px; margin: 0 auto;">
      <div class="section-header" style="text-align: center; margin-bottom: 40px;">
        <div class="section-label" style="letter-spacing: 2px; font-weight: 800; color: var(--primary-600); text-transform: uppercase;">${lang === 'en' ? 'AI Diagnostics' : 'مصنوعی ذہانت سے تشخیص'}</div>
        <h2 class="section-title" style="font-size: 2.8rem; margin-top: 10px; font-weight: 900;">${lang === 'en' ? 'Photo Scanner' : 'فوٹو اسکینر'}</h2>
        <p class="section-desc" style="font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; margin: 15px auto 0;">${lang === 'en' ? 'Upload a photo of the affected plant for an immediate health assessment.' : 'فوری تشخیص کے لیے متاثرہ پودے کی تصویر اپ لوڈ کریں۔'}</p>
      </div>

      <div class="ai-detection-panel glass-card animate-fade-in" style="padding: 45px; background: var(--bg-surface); border: 2px solid var(--primary-200); box-shadow: var(--shadow-xl); border-radius: 30px;">
        <div style="text-align: center;">
          <div id="dropzone" class="ai-dropzone" onclick="document.getElementById('disease-img-input').click()" 
               style="border: 3px dashed var(--primary-300); border-radius: 24px; padding: 60px 30px; text-align: center; cursor: pointer; background: var(--primary-50); transition: 0.4s; min-height: 400px; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden;">
            
            <div id="preview-container" style="display: none; height: 100%; width: 100%;">
              <img id="image-preview" style="max-width: 100%; max-height: 350px; object-fit: contain; border-radius: 16px; box-shadow: var(--shadow-lg);">
            </div>
            
            <div id="upload-prompt">
              <div style="width: 100px; height: 100px; background: var(--primary-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px;">
                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <p style="font-weight: 800; font-size: 1.4rem; color: var(--primary-900);">${lang === 'en' ? 'Select Crop Image' : 'فصل کی تصویر منتخب کریں'}</p>
              <p style="font-size: 1rem; color: var(--text-muted);">${lang === 'en' ? 'JPG and PNG formats supported' : 'جے پی جی اور پی این جی فارمیٹس سپورٹڈ ہیں'}</p>
            </div>
          </div>
          
          <input type="file" id="disease-img-input" accept="image/*" style="display: none;" onchange="previewDiseaseImage(event)">
          
          <button class="btn btn-primary btn-lg" onclick="runAIDiagnosis()" style="width: 100%; max-width: 450px; margin: 40px auto 0; height: 70px; font-size: 1.3rem; font-weight: 900; border-radius: 20px; box-shadow: 0 15px 35px rgba(16, 185, 129, 0.35); background: linear-gradient(135deg, var(--primary-500), var(--primary-700)); color: white; border: none; cursor: pointer;">
            ${lang === 'en' ? 'Start Analysis' : 'تجزیہ شروع کریں'}
          </button>
        </div>

        <div id="ai-results-container" style="display: none; margin-top: 60px; padding-top: 45px; border-top: 3px solid var(--gray-100);">
          <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 35px;">
              <h4 style="font-size: 1.5rem; color: var(--text-primary); font-weight: 800;">
                ${lang === 'en' ? 'Diagnostic Results' : 'تشخیصی نتائج'}
              </h4>
          </div>
          <div id="ai-results-list" style="display: flex; flex-direction: column; gap: 25px;">
          </div>
        </div>
      </div>
    </div>`;

  return `${renderNavbar()}<main class="page-transition-enter" style="padding-top:100px">${content}</main>${renderFooter ? renderFooter() : ''}`;
}

function previewDiseaseImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const preview = document.getElementById('image-preview');
    preview.src = e.target.result;
    document.getElementById('preview-container').style.display = 'block';
    document.getElementById('upload-prompt').style.display = 'none';
    const dz = document.getElementById('dropzone');
    dz.style.background = 'white';
    dz.style.borderStyle = 'solid';
    dz.style.borderColor = 'var(--primary-200)';
  }
  reader.readAsDataURL(file);
}

async function runAIDiagnosis() {
  const imgElement = document.getElementById('image-preview');
  const resultsContainer = document.getElementById('ai-results-container');
  const resultsList = document.getElementById('ai-results-list');

  if (!imgElement || !imgElement.src || document.getElementById('preview-container').style.display === 'none') {
    showToast(state.lang === 'en' ? "Please upload an image" : "براہ کرم تصویر اپ لوڈ کریں", "error");
    return;
  }

  resultsContainer.style.display = 'block';
  resultsList.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="loader-spinner" style="margin: 0 auto 15px;"></div>
            <p style="font-weight: 600; color: var(--text-secondary);">Analyzing plant health...</p>
        </div>`;
resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    const results = await AIDiseaseEngine.detectDisease({ imageElement: imgElement });

    if (!results || results.length === 0) {
      resultsList.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-muted);">No significant patterns found.</div>';
      return;
    }

    resultsList.innerHTML = results.slice(0, 1).map(res => {
      const disease = state.diseases.find(d => d.id === res.diseaseId);
      if (!disease) return '';

      const confidenceColor = res.confidence > 80 ? '#10b981' : (res.confidence > 50 ? '#f59e0b' : '#6b7280');
      const severityColor = disease.severity === 'Very High' ? '#dc2626' : (disease.severity === 'High' ? '#f97316' : '#b45309');

      return `
                <div class="ai-result-card glass-card" style="padding: 40px; border-top: 10px solid ${confidenceColor}; background: var(--bg-surface); border-radius: 24px; border: 1px solid var(--gray-100); transition: 0.3s; box-shadow: var(--shadow-xl); margin-bottom: 40px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid var(--gray-50); padding-bottom: 20px;">
                        <h5 style="margin: 0; font-size: 1.8rem; font-weight: 900; color: var(--text-primary); text-transform: uppercase; letter-spacing: -0.5px;">
                            ${state.lang === 'en' ? 'Laboratory Analysis Report' : 'لیبارٹری تجزیہ رپورٹ'}
                        </h5>
                        <div style="background: ${confidenceColor}; color: white; padding: 8px 18px; border-radius: 12px; font-size: 0.9rem; font-weight: 800;">
                            REPORT ID: #AG-${Math.floor(Math.random() * 9000) + 1000}
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div class="report-item" style="padding: 15px; background: var(--gray-50); border-radius: 12px;">
                            <div style="font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; margin-bottom: 5px;">Crop</div>
                            <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary);">${disease.crop}</div>
                        </div>
                        <div class="report-item" style="padding: 15px; background: var(--gray-50); border-radius: 12px;">
                            <div style="font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; margin-bottom: 5px;">Condition</div>
                            <div style="font-size: 1.2rem; font-weight: 800; color: ${disease.condition === 'Healthy' ? '#10b981' : '#dc2626'};">${disease.condition}</div>
                        </div>
                        <div class="report-item" style="padding: 15px; background: var(--gray-50); border-radius: 12px; border-left: 4px solid var(--primary-500);">
                            <div style="font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; margin-bottom: 5px;">
                                ${state.lang === 'en' ? 'Disease Name' : 'بیماری کا نام'}
                            </div>
                            <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary);">${state.lang === 'en' ? disease.name : disease.ur_name}</div>
                        </div>
                        <div class="report-item" style="padding: 15px; background: var(--gray-50); border-radius: 12px; border-left: 4px solid ${severityColor};">
                            <div style="font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; margin-bottom: 5px;">
                                ${state.lang === 'en' ? 'Threat Level' : 'خطرہ کی سطح'}
                            </div>
                            <div style="font-size: 1.2rem; font-weight: 800; color: ${severityColor}; display: flex; align-items: center; gap: 4px;">
                                ${disease.severity === 'High' || disease.severity === 'Very High' ? '🔴 ' : disease.severity === 'Medium' ? '🟡 ' : '🟢 '}
                                ${state.lang === 'en' ? disease.severity : (disease.severity === 'High' || disease.severity === 'Very High' ? 'شدید خطرہ' : disease.severity === 'Medium' ? 'درمیانہ خطرہ' : 'کوئی خطرہ نہیں')}
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 0.85rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; margin-bottom: 8px;">
                            🔍 ${state.lang === 'en' ? 'What does it look like? (Symptoms)' : 'یہ کیسی دکھتی ہے؟ (علامات)'}
                        </div>
                        <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.5; background: var(--bg-surface); border: 1.5px solid var(--border-color); padding: 16px; border-radius: 12px; margin: 0;">
                            ${state.lang === 'en' ? disease.symptoms : disease.ur_symptoms}
                        </p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary-600); text-transform: uppercase; margin-bottom: 8px;">
                            💊 ${state.lang === 'en' ? 'Easy Treatment / Advise' : 'آسان علاج اور مشورہ'}
                        </div>
                        <p style="font-size: 1.05rem; color: var(--primary-900); font-weight: 700; line-height: 1.5; background: var(--primary-50); border: 1.5px solid var(--primary-100); padding: 16px; border-radius: 12px; margin: 0;">
                            ${state.lang === 'en' ? disease.treatment : disease.ur_treatment}
                        </p>
                    </div>

                    <div style="background: var(--bg-surface-alt); border-radius: 16px; padding: 16px; border: 1.5px solid var(--border-color); margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="font-weight: 800; font-size: 0.9rem; color: var(--text-primary);">
                                ${state.lang === 'en' ? 'Accuracy Rating (How sure the AI is)' : 'پیشن گوئی کی یقین دہانی'}
                            </span>
                            <span style="font-size: 1.15rem; font-weight: 900; color: ${confidenceColor};">${res.confidence}%</span>
                        </div>
                        <div style="height: 10px; width: 100%; background: var(--border-color); border-radius: 5px; overflow: hidden;">
                            <div style="width: ${res.confidence}%; height: 100%; background: ${confidenceColor}; border-radius: 5px;"></div>
                        </div>
                    </div>

                    <!-- Weather Triggers -->
                    <div style="padding: 16px; background: var(--bg-surface-alt); border-radius: 16px; border: 1.5px solid var(--border-color); margin-bottom: 20px;">
                        <h4 style="margin: 0 0 12px 0; font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">
                            ⚠️ ${state.lang === 'en' ? 'Weather Warning (Triggers)' : 'موسم کی وارننگ (بیماری کی وجوہات)'}
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                            <div style="padding: 8px; background: var(--bg-surface); border-radius: 8px; border: 1.5px solid var(--border-color);">
                                <span style="font-size: 1.4rem; display: block; margin-bottom: 4px;">🌧️</span>
                                <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary);">
                                    ${state.lang === 'en' ? 'High Humidity' : 'ہوا میں نمی'}
                                </span>
                            </div>
                            <div style="padding: 8px; background: var(--bg-surface); border-radius: 8px; border: 1.5px solid var(--border-color);">
                                <span style="font-size: 1.4rem; display: block; margin-bottom: 4px;">🌡️</span>
                                <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary);">
                                    ${state.lang === 'en' ? 'Hot Days' : 'تیز گرمی'}
                                </span>
                            </div>
                            <div style="padding: 8px; background: var(--bg-surface); border-radius: 8px; border: 1.5px solid var(--border-color);">
                                <span style="font-size: 1.4rem; display: block; margin-bottom: 4px;">💧</span>
                                <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary);">
                                    ${state.lang === 'en' ? 'Wet Soil' : 'کھڑا پانی'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Do's and Don'ts Guidelines -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
                        <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 12px; color: #166534;">
                            <h5 style="margin: 0 0 8px 0; font-size: 0.85rem; font-weight: 800;">
                                ✅ ${state.lang === 'en' ? 'Do This' : 'یہ کام کریں'}
                            </h5>
                            <ul style="margin: 0; padding-left: 15px; font-size: 0.75rem; font-weight: 600; line-height: 1.4;">
                                <li>${state.lang === 'en' ? 'Cut infected leaves' : 'خراب پتے کاٹ کر جلائیں'}</li>
                                <li>${state.lang === 'en' ? 'Water at roots only' : 'صرف پودے کی جڑ میں پانی دیں'}</li>
                                <li>${state.lang === 'en' ? 'Keep plants clean' : 'کھاد اور مٹی صاف رکھیں'}</li>
                            </ul>
                        </div>
                        <div style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 12px; padding: 12px; color: #991b1b;">
                            <h5 style="margin: 0 0 8px 0; font-size: 0.85rem; font-weight: 800;">
                                ❌ ${state.lang === 'en' ? 'Avoid This' : 'یہ نہ کریں'}
                            </h5>
                            <ul style="margin: 0; padding-left: 15px; font-size: 0.75rem; font-weight: 600; line-height: 1.4;">
                                <li>${state.lang === 'en' ? 'Do not flood field' : 'فالتو پانی جمع نہ ہونے دیں'}</li>
                                <li>${state.lang === 'en' ? 'Do not spray in wind' : 'تیز ہوا میں سپرے نہ کریں'}</li>
                                <li>${state.lang === 'en' ? 'Don\'t touch healthy leaves' : 'بیمار پتوں کے بعد ہاتھ دھوئیں'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
    }).join('');

    // Saved top diagnosis to database
    setTimeout(() => {
        // Safe placeholder
    }, 100);

    // Save top diagnosis to database
    if (results.length > 0) {
      const topRes = results[0];
      const topDisease = state.diseases.find(d => d.id === topRes.diseaseId);
      if (topDisease) {
        fetch(`${API_URL}?action=saveDiagnosis`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            disease_name: topDisease.name,
            confidence: topRes.confidence,
            crop: topDisease.crop
          })
        }).catch(err => console.error("Failed to save diagnosis to DB", err));
      }
    }


  } catch (error) {
    console.error("AI Diagnosis failed", error);
    resultsList.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--red-500); font-weight: 600;">${error.message || "Analysis error. Please try again later."}</div>`;
  }
}

/**
 * Handles async submission processing for registering new asset crops
 */
async function handleAddCrop(e) {
  e.preventDefault();
  const cropData = {
    farmerId: state.user.id,
    name: $('#cropName').value,
    category: $('#cropCat').value,
    quantity: +$('#cropQty').value,
    unit: $('#cropUnit').value,
    price: +$('#cropPrice').value,
    location: $('#cropLocation').value || state.user.location,
    description: $('#cropDesc').value || '',
    farmer_name: $('#farmerName').value || state.user.name,
    farmer_city: $('#farmerCity').value || state.user.location,
    farmer_phone: $('#farmerPhone').value || state.user.phone
  };

  try {
    const res = await fetch(`${API_URL}?action=addCrop`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cropData)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        state.crops.push(data.crop);
        navigate('dashboard', { tab: 'listings' });
        showToast('Asset effectively registered');
      } else {
        showToast(data.message, 'error');
      }
    } else {
      showToast('Database Error Constraint', 'error');
    }
  } catch (e) {
    console.error(e);
    showToast('API Subsystem Exception', 'error');
  }
}

/**
 * Sends delete routine for an owned asset listing
 */
async function deleteCrop(id) {
  try {
    const res = await fetch(`${API_URL}?action=deleteCrop`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        state.crops = state.crops.filter(c => c.id !== id);
        showToast('Asset listing disabled');
        render();
      } else {
        showToast(data.message, 'error');
      }
    } else {
      showToast('Server Protocol Error', 'error');
    }
  } catch (e) {
    console.error(e);
    showToast('State Management Network Failure', 'error');
  }
}

/**
 * Commits a state transition update indicating negotiation flow response.
 */
async function handleOffer(id, status) {
  try {
    const res = await fetch(`${API_URL}?action=updateOffer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, status })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        const o = state.offers.find(x => x.id === id);
        if (o) o.status = status;
        showToast(status === 'accepted' ? 'Transaction Accepted' : 'Transaction Refused');
        render();
      } else {
        showToast(data.message, 'error');
      }
    } else {
      showToast('Constraint Exception', 'error');
    }
  } catch (e) {
    console.error(e);
    showToast('Platform Synchronization Failure', 'error');
  }
}

// ==================== BUYER DASHBOARD ====================
/**
 * Assembles all views and workflows related to a Buyer Role
 */
function renderBuyerDashboard() {
  const tabs = [
    { key: 'overview', label: 'Dashboard Overview' },
    { key: 'myoffers', label: 'Commitments / Offers' },
    { key: 'watchlist', label: 'My Watchlist' },
    { key: 'insights', label: 'Market Insights' },
  ];

  const myOffers = state.offers.filter(o => o.buyerId === state.user.id);
  let content = '';

  if (state.sidebarTab === 'overview') {
    // Prepare Data for Charts
    const accepted = myOffers.filter(o => o.status === 'accepted').length;
    const pending = myOffers.filter(o => o.status === 'pending').length;
    const rejected = myOffers.filter(o => o.status === 'rejected').length;

    // Timeline data (Group offers by date)
    const dateCounts = {};
    myOffers.forEach(o => {
      dateCounts[o.date] = (dateCounts[o.date] || 0) + 1;
    });
    const sortedDates = Object.keys(dateCounts).sort();
    const timelineData = sortedDates.map(d => dateCounts[d]);

    setTimeout(() => {
      // Doughnut Chart for Status
      const ctxStatus = document.getElementById('offerStatusChart');
      if (ctxStatus && window.Chart) {
        if (window.buyerStatusChart) window.buyerStatusChart.destroy();
        window.buyerStatusChart = new Chart(ctxStatus, {
          type: 'doughnut',
          data: {
            labels: ['Accepted', 'Pending', 'Rejected'],
            datasets: [{
              data: [accepted, pending, rejected],
              backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
              borderWidth: 0,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
              legend: { position: 'bottom' }
            }
          }
        });
      }

      // Line Chart for Timeline
      const ctxTimeline = document.getElementById('offerTimelineChart');
      if (ctxTimeline && window.Chart) {
        if (window.buyerTimelineChart) window.buyerTimelineChart.destroy();
        window.buyerTimelineChart = new Chart(ctxTimeline, {
          type: 'line',
          data: {
            labels: sortedDates.length ? sortedDates : ['No Data'],
            datasets: [{
              label: 'Offers Made',
              data: timelineData.length ? timelineData : [0],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#3b82f6',
              pointBorderWidth: 2,
              pointRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } }
            }
          }
        });
      }
    }, 50);

    content = `
      <style>
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-stagger-1 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .anim-stagger-2 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
        .anim-stagger-3 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
        .anim-stagger-4 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
        .anim-stagger-5 { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both; }
      </style>
      <div class="dash-header anim-stagger-1">
        <div><h1>Buyer Statistics</h1><p>Primary operating environment for ${state.user.name}</p></div>
        <div class="dash-header-actions"><button class="btn btn-primary" onclick="navigate('marketplace')">Market Query Mode</button></div>
      </div>
      <div class="dash-stats">
        <div class="dash-stat-card anim-stagger-1"><div class="stat-label">Total Offers</div><div class="stat-main"><div class="stat-value">${myOffers.length}</div><div class="stat-icon amber">TO</div></div></div>
        <div class="dash-stat-card anim-stagger-2"><div class="stat-label">Accepted</div><div class="stat-main"><div class="stat-value">${accepted}</div><div class="stat-icon green">AC</div></div></div>
        <div class="dash-stat-card anim-stagger-3"><div class="stat-label">Pending</div><div class="stat-main"><div class="stat-value">${pending}</div><div class="stat-icon">PD</div></div></div>
      </div>
      
      <div style="display:grid; grid-template-columns: 1fr 2fr; gap: 24px; margin-bottom: 24px;" class="anim-stagger-5">
        <div class="dash-table-card" style="padding: 20px;">
          <h3>Offer Status Breakdown</h3>
          <div style="position: relative; height: 220px; width: 100%; margin-top: 16px;">
            <canvas id="offerStatusChart"></canvas>
          </div>
        </div>
        <div class="dash-table-card" style="padding: 20px;">
          <h3>Offer Timeline</h3>
          <div style="position: relative; height: 220px; width: 100%; margin-top: 16px;">
            <canvas id="offerTimelineChart"></canvas>
          </div>
        </div>
      </div>

      <div class="dash-table-card anim-stagger-5">
        <div class="dash-table-header"><h3>Chronological Outbound Flow</h3></div>
        <table class="dash-table">
          <thead><tr><th>Asset Item</th><th>Vendor Target</th><th>Valuation Bound</th><th>State Status</th><th>Recorded Date</th></tr></thead>
          <tbody>
          ${myOffers.map(o => {
      const crop = state.crops.find(c => c.id === o.cropId);
      const farmer = crop ? getFarmer(crop.farmerId) : null;
      return `<tr><td>${crop?.name || '---'}</td><td>${farmer?.name || '---'}</td><td>Rs. ${o.offeredPrice}</td><td><span class="status-badge ${o.status}">${o.status}</span></td><td>${o.date}</td></tr>`;
    }).join('')}
          </tbody>
        </table>
      </div>`;

  } else if (state.sidebarTab === 'myoffers') {
    content = `
      <div class="dash-header"><div><h1>Extensive Commitment Log</h1><p>Detailed tracking of all ongoing and terminated negotiations</p></div></div>
      <div class="dash-table-card">
        <table class="dash-table">
          <thead><tr><th>Asset Marker</th><th>Vendor Rep</th><th>Offer Bid</th><th>List Price Requirement</th><th>Communications Log</th><th>Negotiation Phase</th></tr></thead>
          <tbody>
          ${myOffers.map(o => {
      const crop = state.crops.find(c => c.id === o.cropId);
      const farmer = crop ? getFarmer(crop.farmerId) : null;
      const isStale = o.status === 'pending' && isOld(o.date, 7);
      return `
            <tr class="${isStale ? 'highlight-old' : ''}" title="${isStale ? 'Delayed response detected' : ''}">
              <td><strong>${crop?.name || '---'}</strong> ${isStale ? '<span class="status-badge badge-old" style="margin-left:8px;font-size:0.7rem">Stalled</span>' : ''}</td>
              <td>${farmer?.name || '---'}</td>
              <td>Rs. ${o.offeredPrice}</td>
              <td>Rs. ${crop?.price || '---'}</td>
              <td style="max-width:180px;font-size:.82rem;color:var(--gray-500)">${o.message || '---'}</td>
              <td><span class="status-badge ${o.status}">${o.status}</span></td>
            </tr>`;
    }).join('')}
          </tbody>
        </table>
      </div>`;

  } else if (state.sidebarTab === 'watchlist') {
    const watchItems = state.crops.filter(c => state.watchlist.includes(c.id));
    content = `
      <div class="dash-header"><div><h1>Personalized Watchlist</h1><p>Monitor specific crop listings you have prioritized for potential acquisition</p></div></div>
      <div class="dash-table-card">
        ${watchItems.length > 0 ? `
        <table class="dash-table">
          <thead><tr><th>Commodity</th><th>Current Valuation</th><th>Host Node</th><th>Stock Volume</th><th>Actions</th></tr></thead>
          <tbody>
          ${watchItems.map(c => {
      const farmer = getFarmer(c.farmerId);
      return `
            <tr>
              <td><div style="display:flex;align-items:center;gap:10px"><span>${getCropEmoji(c.name)}</span><strong>${c.name}</strong></div></td>
              <td>Rs. ${c.price}/${c.unit}</td>
              <td>${farmer?.name || '---'}</td>
              <td>${c.quantity} ${c.unit}</td>
              <td>
                <button class="btn btn-primary btn-sm" onclick="navigate('marketplace',{crop:${JSON.stringify(c).replace(/"/g, '&quot;')}})">View Detail</button>
                <button class="btn btn-ghost btn-sm" onclick="toggleWatchlist(${c.id})">Remove</button>
              </td>
            </tr>`;
    }).join('')}
          </tbody>
        </table>` : `
        <div style="padding:60px;text-align:center;color:var(--gray-400)">
          <div style="font-size:3rem;margin-bottom:20px">🔖</div>
          <h3>Your watchlist is empty</h3>
          <p>Browse the marketplace and save crops to monitor their availability</p>
          <button class="btn btn-primary" style="margin-top:20px" onclick="navigate('marketplace')">Explore Marketplace</button>
        </div>`}
      </div>`;

  } else if (state.sidebarTab === 'insights') {
    const regions = [...new Set(state.regional_stats.map(s => s.region))];
    const buyerRegion = state.buyerInsightRegion || state.user.location;
    const selectedRegion = regions.includes(buyerRegion) ? buyerRegion : (regions[0] || 'Mianwali');
    const regionalData = state.regional_stats.filter(s => s.region === selectedRegion);

    // After DOM updates, render the Chart.js chart
    setTimeout(() => {
      const ctx = document.getElementById('insightsMarketChart');
      if (ctx && window.Chart) {
        if (window.insightsMarketChartInstance) {
          window.insightsMarketChartInstance.destroy();
        }
        window.insightsMarketChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: regionalData.map(d => d.crop_name),
            datasets: [{
              label: 'Average Price (Rs)',
              data: regionalData.map(d => d.avg_price),
              backgroundColor: 'rgba(56, 189, 140, 0.6)',
              borderColor: 'rgba(56, 189, 140, 1)',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return 'Rs. ' + context.parsed.y;
                  }
                }
              }
            },
            scales: {
              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } }
            }
          }
        });
      }
    }, 50);

    content = `
      <div class="dash-header">
        <div><h1>Regional Market Insights</h1><p>Strategic analysis for procurement based on ${selectedRegion} data stream</p></div>
        <div class="dash-header-actions">
          <select class="form-select" onchange="state.buyerInsightRegion=this.value; render();" style="width:250px; font-weight: 600;">
            ${regions.length > 0 ? regions.map(r => `<option value="${r}" ${r === selectedRegion ? 'selected' : ''}>${r}</option>`).join('') : '<option>No Regions Available</option>'}
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns: 1fr; gap:24px; margin-bottom:24px;">
        <div class="dash-table-card" style="padding:20px; min-height: 300px;">
          <h3 style="margin-bottom: 20px; color: var(--text-primary);">Crop Price Distribution (${selectedRegion})</h3>
          <div style="position: relative; height: 250px; width: 100%;">
            <canvas id="insightsMarketChart"></canvas>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns: 1.5fr 1fr; gap:24px">
        <div class="dash-table-card">
          <div class="dash-table-header"><h3>Recommended Commodities</h3></div>
          <div style="padding:20px">
            <p style="font-size:.88rem;color:var(--gray-500);margin-bottom:20px">Based on current market demand in your region, these crops offer stable procurement opportunities.</p>
            <div style="display:flex;flex-direction:column;gap:12px">
              ${regionalData.slice(0, 4).map(s => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:var(--bg-surface-alt, var(--gray-50));border-radius:var(--radius-md);border-left:4px solid var(--primary-500)">
                  <div style="display:flex;align-items:center;gap:12px">
                    <span style="font-size:1.4rem">${getCropEmoji(s.crop_name)}</span>
                    <div><div style="font-weight:700">${s.crop_name}</div><div style="font-size:.75rem;color:var(--primary-600)">Demand: ${s.demand_level}%</div></div>
                  </div>
                  <div style="text-align:right"><div style="font-weight:700">${s.avg_yield}</div><div style="font-size:.7rem;color:var(--gray-400)">Avg Yield</div></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="dash-table-card">
          <div class="dash-table-header"><h3>Procurement Advisory</h3></div>
          <div style="padding:24px; font-size:.9rem; line-height:1.6; color:var(--gray-600)">
            <div style="margin-bottom:20px;padding:16px;background:var(--primary-50);border-radius:var(--radius-md);color:var(--primary-700);font-weight:500">
              💡 <strong>Pro-Tip:</strong> Current indices show an increase in demand within ${selectedRegion}. Consider early commitments to lock in favorable valuations.
            </div>
            <p>Market dynamics suggest a shift towards cash crops in the coming quarter. We recommend diversifying your supply chain nodes to mitigate seasonal volatility.</p>
            <ul style="margin-top:16px;padding-left:20px">
              <li>Monitor top-demand crops: ${regionalData.slice(0, 2).map(r => r.crop_name).join(', ') || 'Wheat'}</li>
              <li>Logistics costs stabilized</li>
            </ul>
          </div>
        </div>
      </div>`;

  } else if (state.sidebarTab === 'browse') {
    // Redirect context
    navigate('marketplace');
    return '';
  }

  return `${renderNavbar()}<div class="dashboard">${renderSidebar(tabs)}<div class="main-content page-transition-enter">${content}</div></div>`;
}

// ==================== ADMIN DASHBOARD ====================
/**
 * Administrator console rendering module spanning full app database insights.
 */
function renderAdminDashboard() {
  const tabs = [
    { key: 'overview', label: 'System Overview' },
    { key: 'users', label: 'Identity Directory' },
    { key: 'allcrops', label: 'Total Global Listings' },
    { key: 'alloffers', label: 'Trade Exchange Stream' },
    { key: 'diseases', label: 'Diseases Management' },
  ];

  let content = '';
  const farmers = window.USERS_DATA.filter(u => u.role === 'farmer');
  const buyers = window.USERS_DATA.filter(u => u.role === 'buyer');

  if (state.sidebarTab === 'overview') {
    content = `
      <div class="dash-header"><div><h1>Global Administration Center</h1><p>Top level application overview</p></div></div>
      <div class="dash-stats">
        <div class="dash-stat-card"><div class="stat-label">Total Users</div><div class="stat-main"><div class="stat-value">${window.USERS_DATA.length}</div><div class="stat-icon green">US</div></div></div>
        <div class="dash-stat-card"><div class="stat-label">Total Listings</div><div class="stat-main"><div class="stat-value">${state.crops.length}</div><div class="stat-icon">CT</div></div></div>
        <div class="dash-stat-card"><div class="stat-label">Total Offers</div><div class="stat-main"><div class="stat-value">${state.offers.length}</div><div class="stat-icon blue">OF</div></div></div>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
        <div class="dash-table-card">
          <div class="dash-table-header"><h3>Transaction Ledger</h3></div>
          <table class="dash-table">
            <thead><tr><th>Asset Profile</th><th>Target Node</th><th>Clearing Val</th><th>System State</th></tr></thead>
            <tbody>
            ${state.offers.slice(0, 5).map(o => {
      const crop = state.crops.find(c => c.id === o.cropId);
      const buyer = window.USERS_DATA.find(u => u.id === o.buyerId);
      return `<tr><td>${crop?.name || '---'}</td><td>${buyer?.name || '---'}</td><td>Rs.${o.offeredPrice}</td><td><span class="status-badge ${o.status}">${o.status}</span></td></tr>`;
    }).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="dash-table-card">
          <div class="dash-table-header"><h3>Telemetry Log</h3></div>
          <div style="padding:20px">
            ${[
        { t: 'Account registration logged: kashmala fatimah', time: 'Recently', icon: '[+]' },
        { t: 'Wheat index modified by azan mehdi', time: 'T-Minus 5 hours', icon: '[M]' },
        { t: 'Transaction Finality Reached: Rice clearing protocol', time: 'T-Minus 24 hours', icon: '[-]' }
      ].map(a => `
            <div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--gray-50)">
              <span style="font-size:1.2rem; font-weight:700">${a.icon}</span>
              <div><div style="font-size:.88rem;font-weight:500">${a.t}</div><div style="font-size:.75rem;color:var(--gray-400)">${a.time}</div></div>
            </div>`).join('')}
          </div>
        </div>
      </div>`;

  } else if (state.sidebarTab === 'users') {
    content = `
      <div class="dash-header"><div><h1>Identity Control</h1><p>Approve or revoke access for system users</p></div></div>
      <div class="dash-table-card">
        <table class="dash-table">
          <thead><tr><th>Entity Name</th><th>Authentication Vector</th><th>Role</th><th>Approval Status</th><th>Actions</th></tr></thead>
          <tbody>
          ${window.USERS_DATA.filter(u => u.role !== 'admin').map(u => {
      const isApproved = u.is_approved === 1;
      return `
          <tr>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td><span class="status-badge ${u.role === 'farmer' ? 'available' : 'pending'}" style="text-transform:capitalize">${u.role}</span></td>
            <td><span class="status-badge ${isApproved ? 'accepted' : 'rejected'}">${isApproved ? 'Approved' : 'Pending'}</span></td>
            <td>
              <button class="btn ${isApproved ? 'btn-ghost' : 'btn-primary'} btn-sm" onclick="toggleUserApproval(${u.id}, ${u.is_approved})">
                ${isApproved ? 'Revoke Access' : 'Approve User'}
              </button>
            </td>
          </tr>`;
    }).join('')}
          </tbody>
        </table>
      </div>`;

  } else if (state.sidebarTab === 'allcrops') {
    content = `
      <div class="dash-header"><div><h1>Commodity Catalog Stream</h1><p>Global oversight context over active inventory matrices</p></div></div>
      <div class="dash-table-card">
        <table class="dash-table">
          <thead><tr><th>Market Profile</th><th>Host Origin Node</th><th>Sector</th><th>Quantity Frame</th><th>Base Requirement</th><th>Lifecycle</th></tr></thead>
          <tbody>
          ${state.crops.map(c => {
      const farmer = getFarmer(c.farmerId);
      const isStale = c.status === 'available' && isOld(c.listedDate, 14);
      return `
            <tr class="${isStale ? 'highlight-old' : ''}">
              <td><strong>${c.name}</strong> ${isStale ? '<span class="status-badge badge-old" style="margin-left:8px;font-size:0.7rem">Stale</span>' : ''}</td>
              <td>${farmer?.name || '---'}</td>
              <td>${c.category}</td>
              <td>${c.quantity} ${c.unit}</td>
              <td>Rs.${c.price}</td>
              <td><span class="status-badge ${c.status}">${c.status}</span></td>
            </tr>`;
    }).join('')}
          </tbody>
        </table>
      </div>`;

  } else if (state.sidebarTab === 'alloffers') {
    content = `
      <div class="dash-header"><div><h1>Aggregated Negotiation Logs</h1><p>Total transparency into inter-nodal commerce operations</p></div></div>
      <div class="dash-table-card">
        <table class="dash-table">
          <thead><tr><th>Related Asset</th><th>Initiation Buyer</th><th>Destination Host</th><th>Protocol Commitment</th><th>Conclusion</th><th>Timestamp</th></tr></thead>
          <tbody>
          ${state.offers.map(o => {
      const crop = state.crops.find(c => c.id === o.cropId);
      const buyer = window.USERS_DATA.find(u => u.id === o.buyerId);
      const farmer = crop ? getFarmer(crop.farmerId) : null;
      const isStale = o.status === 'pending' && isOld(o.date, 7);
      return `
            <tr class="${isStale ? 'highlight-old' : ''}">
              <td>${crop?.name || '---'} ${isStale ? '<span class="status-badge badge-old" style="margin-left:8px;font-size:0.7rem">Stale</span>' : ''}</td>
              <td>${buyer?.name || '---'}</td>
              <td>${farmer?.name || '---'}</td>
              <td>Rs.${o.offeredPrice}</td>
              <td><span class="status-badge ${o.status}">${o.status}</span></td>
              <td>${o.date}</td>
            </tr>`;
    }).join('')}
          </tbody>
        </table>
      </div>`;
  } else if (state.sidebarTab === 'diseases') {
    content = `
      <div class="dash-header">
        <div>
          <h1>Diseases Database Control</h1>
          <p>Maintain the system-wide diagnostic dictionary and reference images.</p>
        </div>
        <div class="dash-header-actions">
          <button class="btn btn-primary" onclick="showDiseaseModal()">+ Add New Disease</button>
        </div>
      </div>
      <div class="dash-table-card">
        <table class="dash-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Disease Name</th>
              <th>Target Crop</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Urdu Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.diseases.map(d => `
              <tr>
                <td><img src="${d.image}" alt="${d.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--gray-200);"></td>
                <td><strong>${d.name}</strong></td>
                <td>${d.crop}</td>
                <td><span class="status-badge pending" style="text-transform: capitalize">${d.type}</span></td>
                <td><span class="status-badge ${d.severity === 'Very High' || d.severity === 'High' ? 'rejected' : 'accepted'}">${d.severity}</span></td>
                <td>${d.ur_name}</td>
                <td>
                  <button class="btn btn-primary btn-sm" onclick="showDiseaseModal(${d.id})">Edit</button>
                  <button class="btn btn-ghost btn-sm" style="margin-left:5px" onclick="deleteDisease(${d.id})">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  } else if (state.sidebarTab === 'browse') {
    navigate('marketplace');
    return '';
  }

  return `${renderNavbar()}<div class="dashboard">${renderSidebar(tabs)}<div class="main-content page-transition-enter">${content}</div></div>`;
}

// ==================== ROUTER BOOTSTRAP & GLOBALS ====================
function render() {
  const pages = {
    home: renderHome,
    login: renderLogin,
    register: renderRegister,
    dashboard: renderDashboard,
    marketplace: renderMarketplace,
    regional: renderRegionalAnalysisPage,
    schemes: renderGovtSchemesPage,
    diseases: renderDiseasesPage,
    help: () => renderResourcePage('help'),
    pricing: () => renderResourcePage('pricing'),
    calendar: () => renderResourcePage('calendar'),
  };

  // Auto-redirect logged-in users from home to dashboard
  if (state.user && state.currentPage === "home") {
    state.currentPage = "dashboard";
  }

  const renderer = pages[state.currentPage] || renderHome;
  app().innerHTML = renderer();
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

window.toggleUserApproval = async function (userId, currentStatus) {
  const newStatus = currentStatus === 1 ? 0 : 1;
  try {
    const res = await fetch(`${API_URL}?action=approveUser`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, status: newStatus }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        const user = window.USERS_DATA.find(u => u.id === userId);
        if (user) user.is_approved = newStatus;
        showToast("User status updated successfully!");
        render();
      } else {
        showToast(data.message || "Error updating user", "error");
      }
    } else {
      showToast("Failed to communicate with server", "error");
    }
  } catch (e) {
    console.error(e);
    showToast("Network Error", "error");
  }
};

window.showDiseaseModal = function(id = null) {
  const d = id ? state.diseases.find(item => item.id === id) : null;
  const title = d ? 'Edit Disease' : 'Add New Disease';
  
  const modal = document.createElement('div');
  modal.id = 'disease-editor-modal';
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '9999';
  
  modal.innerHTML = `
    <div class="modal-card" style="width: 100%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
      <button class="modal-close" onclick="closeDiseaseModal()">&times;</button>
      <h2 style="margin-bottom: 20px;">${title}</h2>
      <form id="disease-form" onsubmit="handleSaveDisease(event, ${id || 'null'})" style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Disease Name (English)</label>
            <input type="text" id="disease-name" class="form-control" value="${d ? d.name : ''}" required style="width:100%;">
          </div>
          <div class="form-group">
            <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Urdu Name (اردو نام)</label>
            <input type="text" id="disease-ur-name" class="form-control" value="${d ? d.ur_name : ''}" required style="width:100%; text-align: right;">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Target Crop(s)</label>
            <input type="text" id="disease-crop" class="form-control" value="${d ? d.crop : ''}" required placeholder="e.g. Rice" style="width:100%;">
          </div>
          <div class="form-group">
            <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Disease Type</label>
            <select id="disease-type" class="form-control" style="width:100%;">
              <option value="Fungal" ${d && d.type === 'Fungal' ? 'selected' : ''}>Fungal</option>
              <option value="Bacterial" ${d && d.type === 'Bacterial' ? 'selected' : ''}>Bacterial</option>
              <option value="Viral" ${d && d.type === 'Viral' ? 'selected' : ''}>Viral</option>
              <option value="Insect Pest" ${d && d.type === 'Insect Pest' ? 'selected' : ''}>Insect Pest</option>
              <option value="Healthy" ${d && d.type === 'Healthy' ? 'selected' : ''}>Healthy (No Disease)</option>
              <option value="Other" ${d && d.type === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Severity</label>
            <select id="disease-severity" class="form-control" style="width:100%;">
              <option value="Low" ${d && d.severity === 'Low' ? 'selected' : ''}>Low</option>
              <option value="Medium" ${d && d.severity === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="High" ${d && d.severity === 'High' ? 'selected' : ''}>High</option>
              <option value="Very High" ${d && d.severity === 'Very High' ? 'selected' : ''}>Very High</option>
            </select>
          </div>
          <div class="form-group">
            <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Condition (Healthy vs. Diseased)</label>
            <select id="disease-condition" class="form-control" style="width:100%;">
              <option value="Diseased" ${d && d.condition_name === 'Diseased' ? 'selected' : ''}>Diseased</option>
              <option value="Healthy" ${d && d.condition_name === 'Healthy' ? 'selected' : ''}>Healthy</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Reference Image URL (Picture Link)</label>
          <input type="url" id="disease-image" class="form-control" value="${d ? d.image : ''}" required placeholder="https://images.unsplash.com/..." style="width:100%;">
        </div>

        <div class="form-group">
          <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Symptoms (English)</label>
          <textarea id="disease-symptoms" class="form-control" rows="2" style="width:100%; resize: vertical;" required>${d ? d.symptoms : ''}</textarea>
        </div>

        <div class="form-group">
          <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Symptoms (Urdu / علامات)</label>
          <textarea id="disease-ur-symptoms" class="form-control" rows="2" style="width:100%; resize: vertical; text-align: right;" required>${d ? d.ur_symptoms : ''}</textarea>
        </div>

        <div class="form-group">
          <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Treatment / Advice (English)</label>
          <textarea id="disease-treatment" class="form-control" rows="2" style="width:100%; resize: vertical;" required>${d ? d.treatment : ''}</textarea>
        </div>

        <div class="form-group">
          <label style="display: block; font-size: 0.85rem; margin-bottom: 6px;">Treatment / Advice (Urdu / علاج)</label>
          <textarea id="disease-ur-treatment" class="form-control" rows="2" style="width:100%; resize: vertical; text-align: right;" required>${d ? d.ur_treatment : ''}</textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
          <button type="button" class="btn btn-ghost" onclick="closeDiseaseModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Disease</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
};

window.closeDiseaseModal = function() {
  const modal = document.getElementById('disease-editor-modal');
  if (modal) modal.remove();
};

window.handleSaveDisease = async function(event, id) {
  event.preventDefault();
  
  const payload = {
    id: id,
    name: document.getElementById('disease-name').value,
    ur_name: document.getElementById('disease-ur-name').value,
    crop: document.getElementById('disease-crop').value,
    type: document.getElementById('disease-type').value,
    severity: document.getElementById('disease-severity').value,
    condition_name: document.getElementById('disease-condition').value,
    image: document.getElementById('disease-image').value,
    symptoms: document.getElementById('disease-symptoms').value,
    ur_symptoms: document.getElementById('disease-ur-symptoms').value,
    treatment: document.getElementById('disease-treatment').value,
    ur_treatment: document.getElementById('disease-ur-treatment').value
  };

  const action = id ? 'updateDisease' : 'addDisease';

  try {
    const res = await fetch(`${API_URL}?action=${action}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        showToast(id ? "Disease updated successfully!" : "Disease added successfully!");
        closeDiseaseModal();
        
        // Refresh local data from API
        const refreshRes = await fetch(`${API_URL}?action=getData`);
        if (refreshRes.ok) {
          const freshData = await refreshRes.json();
          state.diseases = freshData.diseases || [];
        }
        render();
      } else {
        showToast(data.message || "Failed to save disease", "error");
      }
    } else {
      showToast("Server returned an error", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Network Connection Error", "error");
  }
};

window.deleteDisease = async function(id) {
  if (!confirm("Are you sure you want to delete this disease entry?")) return;
  
  try {
    const res = await fetch(`${API_URL}?action=deleteDisease`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        showToast("Disease deleted successfully!");
        
        // Refresh local data from API
        const refreshRes = await fetch(`${API_URL}?action=getData`);
        if (refreshRes.ok) {
          const freshData = await refreshRes.json();
          state.diseases = freshData.diseases || [];
        }
        render();
      } else {
        showToast(data.message || "Failed to delete disease", "error");
      }
    } else {
      showToast("Server returned an error", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Network Connection Error", "error");
  }
};
