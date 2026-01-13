# 🌐 ExusCraft Custom Domain Setup

## **Best Domain Options for ExusCraft:**

### **Recommended Domain Names:**
- `exuscraft.com` 
- `exuscraft.net`
- `exuscraft.io`
- `exuscraft.gg` (gaming focused)
- `exuscraft.games`
- `modforge.com` (if you prefer the ModForge branding)

## **🛒 Where to Buy Domains (Cheapest Options):**

### **Google Domains** (Now Squarespace)
- **Price**: $12-15/year
- **Pros**: Easy setup, good integration
- **Link**: [domains.google.com](https://domains.google.com)

### **Namecheap** (Recommended - Cheapest)
- **Price**: $8-12/year
- **Pros**: Cheapest, great support
- **Link**: [namecheap.com](https://namecheap.com)

### **Cloudflare** (Best Value)
- **Price**: $8-10/year (at cost pricing)
- **Pros**: Free SSL, CDN, security
- **Link**: [cloudflare.com](https://cloudflare.com)

### **GoDaddy**
- **Price**: $12-20/year
- **Pros**: Well-known, easy setup
- **Link**: [godaddy.com](https://godaddy.com)

## **🔧 How to Connect Domain to Render:**

### **Step 1: Buy Your Domain**
1. Choose a registrar above
2. Search for your preferred domain name
3. Purchase the domain (usually $8-15/year)

### **Step 2: Configure DNS in Render**
1. **Go to your Render dashboard**
2. **Click on your ExusCraft service**
3. **Go to "Settings" → "Custom Domains"**
4. **Click "Add Custom Domain"**
5. **Enter your domain**: `exuscraft.com`
6. **Render will give you DNS records to add**

### **Step 3: Add DNS Records**
In your domain registrar (Namecheap, Google, etc.):

1. **Go to DNS Management**
2. **Add these records** (Render will provide exact values):
   ```
   Type: CNAME
   Name: www
   Value: your-app-name.onrender.com
   
   Type: A
   Name: @
   Value: [IP address from Render]
   ```

### **Step 4: Wait for Propagation**
- **Time**: 5 minutes to 24 hours
- **Check**: Visit your domain to see if it works

## **💰 Cost Breakdown:**

### **Total Annual Cost:**
- **Domain**: $8-15/year
- **Hosting**: FREE (Render)
- **SSL Certificate**: FREE (automatic)
- **CDN**: FREE (Render includes)

**Total: $8-15/year for a professional website!**

## **🚀 Recommended Setup:**

### **Best Option for ExusCraft:**
1. **Buy**: `exuscraft.com` from **Namecheap** ($8.88/year)
2. **Host**: Free on **Render**
3. **Result**: `https://exuscraft.com` - Professional gaming marketplace!

### **Alternative Gaming Domains:**
- `exuscraft.gg` - Gaming focused ($20/year)
- `exuscraft.games` - Perfect for gaming ($25/year)
- `exuscraft.io` - Tech/startup vibe ($35/year)

## **⚡ Quick Setup Commands:**

After buying domain, update your environment variables:

```env
BASE_URL=https://exuscraft.com
```

## **🎯 Domain Name Suggestions:**

### **Available Alternatives** (if exuscraft is taken):
- `exuscraftgaming.com`
- `exuscraft-mods.com`
- `theexuscraft.com`
- `exuscraftstore.com`
- `exuscraftmarket.com`

## **🔒 Security & Performance (FREE):**

### **Cloudflare Setup** (Recommended):
1. **After buying domain**, add it to Cloudflare (free)
2. **Benefits**:
   - Free SSL certificate
   - DDoS protection
   - Global CDN (faster loading)
   - Analytics
   - Caching

### **Setup Steps**:
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Change nameservers at your registrar
4. Point to Render in Cloudflare DNS

## **📈 Professional Benefits:**

### **With Custom Domain:**
- ✅ Professional appearance
- ✅ Better SEO ranking
- ✅ Custom email addresses
- ✅ Brand recognition
- ✅ Trust from users

### **vs Free Subdomain:**
- ❌ `exuscraft.onrender.com` (looks amateur)
- ✅ `exuscraft.com` (looks professional)

## **🎉 Final Result:**

Your ExusCraft will be accessible at:
- `https://exuscraft.com`
- `https://www.exuscraft.com`

**Professional gaming marketplace with your own domain! 🚀🎮**

---

**Need help choosing a domain or setting it up? I can guide you through each step!**