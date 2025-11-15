# EventHive Landing Page

A modern, responsive landing page for EventHive - an AI-powered event discovery platform inspired by MeetMux's design principles.

## 🚀 Features

- **Responsive Design**: Optimized for all devices (desktop, tablet, mobile)
- **Modern UI/UX**: Clean, gradient-based design with smooth animations
- **Interactive Elements**:
  - Mobile hamburger menu
  - FAQ accordion
  - Tab-based app preview
  - Smooth scrolling navigation
- **Performance Optimized**: Debounced scroll events, lazy loading, intersection observers
- **SEO Friendly**: Semantic HTML structure with proper meta tags

## 📁 File Structure

```
eh/
├── index.html          # Main HTML structure
├── style.css           # Complete CSS styling with responsive design
├── script.js           # JavaScript functionality and interactions
└── README.md           # This file
```

## 🎨 Design Highlights

### Color Scheme

- **Primary**: Linear gradients (#6366f1 to #8b5cf6)
- **Hero Background**: Gradient (#667eea to #764ba2)
- **Accent**: Orange to yellow gradient (#ff6b6b to #feca57)
- **Text**: Dark grays (#333, #666) for readability

### Typography

- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear heading structure with proper weights
- **Responsive**: Scales appropriately across devices

### Layout Sections

1. **Navigation**: Fixed navbar with blur effect
2. **Hero**: Compelling headline with phone mockup
3. **About**: Brief description of EventHive
4. **Features**: 6-card grid showcasing key features
5. **How It Works**: 3-step process explanation
6. **App Preview**: Tabbed interface mockups
7. **FAQ**: Collapsible question/answer sections
8. **CTA**: Call-to-action for app downloads
9. **Footer**: Links and contact information

## 🛠️ Customization Guide

### Adding Real App Store Links

Replace the placeholder download buttons in `script.js`:

```javascript
// Replace the showDownloadMessage function with actual redirects
function handleDownload(platform) {
  const links = {
    iOS: "https://apps.apple.com/your-app",
    Android: "https://play.google.com/store/apps/details?id=your.app",
  };
  window.open(links[platform], "_blank");
}
```

### Adding Real Images

1. Create an `images/` folder
2. Add your app screenshots, icons, and hero images
3. Replace placeholder content in HTML:
   ```html
   <img src="images/app-screenshot.png" alt="EventHive App Screenshot" />
   ```

### Customizing Content

- **Hero Section**: Update headline and description in `index.html`
- **Features**: Modify the 6 feature cards with your specific benefits
- **FAQ**: Add/remove questions relevant to your app
- **Contact**: Update email and social media links in footer

### Color Customization

Update CSS custom properties at the top of `style.css`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #ff6b6b;
}
```

## 📱 Mobile Optimization

The site is fully responsive with:

- Collapsible navigation menu
- Stacked layouts on smaller screens
- Touch-friendly button sizes
- Optimized font sizes and spacing

## 🎯 Performance Features

- **Lazy Loading**: Images load only when needed
- **Debounced Events**: Optimized scroll performance
- **Intersection Observer**: Efficient animation triggers
- **Smooth Scrolling**: Native CSS smooth scrolling
- **Optimized Assets**: Minimal external dependencies

## 🚀 Getting Started

1. **Local Development**: Simply open `index.html` in your browser
2. **Live Server**: Use VS Code Live Server extension for hot reload
3. **Deployment**: Upload files to any web hosting service

## 📈 Analytics Integration

Add your analytics code before the closing `</body>` tag:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

## 🔧 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📄 License

This project is created for EventHive. Feel free to modify and customize as needed for your brand.

## 🤝 Contributing

To improve the landing page:

1. Test across different devices
2. Optimize loading performance
3. Add accessibility improvements
4. Enhance animations and interactions

---

**EventHive** - Connecting people through shared events and meaningful experiences. 🎉
