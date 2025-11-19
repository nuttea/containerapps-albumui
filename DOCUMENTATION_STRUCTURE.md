# 📚 Documentation Structure

This project uses a streamlined documentation structure with only essential files.

## 📖 Core Documentation (4 files)

### 1. **README.md** (19K) - Main Documentation
**Purpose:** Complete setup and deployment guide
**Contents:**
- Quick start guide
- Prerequisites and setup instructions
- Step-by-step deployment to Azure Container Apps
- Datadog integration configuration
- Architecture diagram (Mermaid)
- Troubleshooting guide
- Local development instructions

**Audience:** Developers, DevOps engineers

### 2. **DEMO_FEATURES.md** (5.8K) - Customer Demo Guide
**Purpose:** Guide for demonstrating Datadog observability features
**Contents:**
- Feature overview (clickable albums, error simulation)
- Technical implementation details
- Datadog UI walkthrough
- Demo script for customer presentations
- What to check in each Datadog product (APM, Logs, RUM, Infrastructure)

**Audience:** Sales engineers, Customer success, Solutions architects

### 3. **CONTRIBUTING.md** (3.8K) - Contribution Guidelines
**Purpose:** Standard GitHub contribution guide
**Contents:**
- How to contribute to the project
- Code standards and practices
- Pull request process

**Audience:** Contributors, open-source community

### 4. **LICENSE.md** (1.1K) - License Information
**Purpose:** Project license terms
**Contents:** MIT License

**Audience:** Legal, compliance

## 🛠️ Configuration Files

### **azure-containerapp.yaml** - Container App Deployment Config
**Purpose:** Azure Container Apps deployment template with Datadog configuration
**Contents:**
- Complete container configuration
- Datadog environment variables with descriptions
- Deployment instructions
- Reference to official Datadog documentation

## 🗂️ Project Structure

```
containerapps-albumui/
├── 📄 README.md                     # Main documentation
├── 📄 DEMO_FEATURES.md              # Demo guide
├── 📄 CONTRIBUTING.md               # Contribution guide
├── 📄 LICENSE.md                    # License
├── 📄 azure-containerapp.yaml       # Deployment config
├── 🔧 rebuild-and-deploy.sh         # Deployment script
├── 🔧 test-local.sh                 # Local testing script
├── 🔧 diagnose.sh                   # Diagnostic helper
├── 📁 src/                          # Application source code
│   ├── Dockerfile                   # With Datadog in-container setup
│   ├── package.json                 # Dependencies (dd-trace, etc.)
│   ├── app.js                       # Express app + Winston logging
│   ├── tracer.js                    # Datadog APM configuration
│   ├── routes/
│   │   └── index.js                 # Routes with albums + error endpoints
│   └── views/
│       ├── layout.pug               # RUM + error demo buttons
│       └── index.pug                # Clickable albums UI
└── .gitignore                       # Excludes .env.local files
```

## 📋 Quick Reference

### For Development
1. **Start here:** `README.md` → Prerequisites section
2. **Local testing:** `test-local.sh`
3. **Deploy:** `rebuild-and-deploy.sh`

### For Demos
1. **Demo preparation:** `DEMO_FEATURES.md` → Demo Script section
2. **Features showcase:** `DEMO_FEATURES.md` → New Features section
3. **Datadog UI:** `DEMO_FEATURES.md` → What to Check in Datadog section

### For Troubleshooting
1. **Container issues:** `README.md` → Troubleshooting section
2. **Quick diagnostics:** Run `./diagnose.sh`
3. **Check logs:** Commands in README troubleshooting section

## 🧹 Removed Files (Consolidated)

The following redundant documentation files were removed:
- ❌ CHANGES.md (12K) - Temporary changelog
- ❌ COMMIT_CHECKLIST.md (4.8K) - Pre-commit validation
- ❌ DATADOG_INTEGRATION_GUIDE.md (17K) - Merged into README
- ❌ DATADOG_OBSERVABILITY_FLOW.md (19K) - Merged into README
- ❌ DATADOG_SETUP_CHECKLIST.md (10K) - Merged into README
- ❌ IMPLEMENTATION_SUMMARY.md (14K) - Temporary notes
- ❌ QUICK_START.md (10K) - Merged into README
- ❌ UPDATED_IMPLEMENTATION_SUMMARY.md (9.9K) - Temporary notes

**Reason:** All essential information is now consolidated in README.md and DEMO_FEATURES.md

## 💡 Documentation Philosophy

This project follows the **"Less is More"** approach:
- ✅ Single source of truth (README.md)
- ✅ Specialized guides when needed (DEMO_FEATURES.md)
- ✅ No duplicate or redundant documentation
- ✅ Clear, concise, actionable content
- ✅ Up-to-date with current implementation

## 🔄 Keeping Docs Updated

When making changes:
1. **Update README.md** for deployment/setup changes
2. **Update DEMO_FEATURES.md** for new demo features
3. **Update azure-containerapp.yaml** for config changes
4. **Don't create new top-level markdown files** - add to existing docs instead

---

**Last Updated:** 2025-11-19
**Documentation Version:** 1.0
