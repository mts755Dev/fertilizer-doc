# Mapbox Integration Setup

This application now includes interactive maps for displaying fertility clinic locations using Mapbox GL JS.

## 🗺️ Features

- **Interactive Maps**: Display clinic locations on an interactive map
- **Geocoding**: Automatically convert addresses to coordinates
- **Custom Markers**: Beautiful clinic markers with hover tooltips
- **Location List**: Clickable list view with Google Maps integration
- **Responsive Design**: Works on desktop and mobile devices

## 🔧 Setup Instructions

### 1. Get a Free Mapbox Access Token

1. Go to [https://account.mapbox.com/](https://account.mapbox.com/)
2. Sign up for a free account
3. Navigate to your account dashboard
4. Create a new access token or use the default public token
5. Copy your access token

### 2. Configure Environment Variables

Create a `.env` file in your project root (if it doesn't exist) and add:

```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

Replace `your_mapbox_access_token_here` with your actual Mapbox access token.

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## 🎯 How It Works

### Clinic Detail Pages
- Each fertility clinic detail page now shows an interactive map
- Clinic locations are automatically geocoded and displayed as markers
- Users can click on markers or locations in the list to focus on specific locations
- Each location has a "Open in Google Maps" button for directions

### Map Features
- **Navigation Controls**: Zoom in/out, rotate, and reset view
- **Fullscreen Mode**: View the map in fullscreen
- **Responsive Markers**: Custom markers with clinic names
- **Auto-fit Bounds**: Map automatically adjusts to show all clinic locations
- **Smooth Animations**: Smooth transitions when focusing on locations

## 🚀 Usage

The map component is automatically integrated into the fertility clinic detail pages. When you visit a clinic page, you'll see:

1. **Interactive Map**: Shows all clinic locations with custom markers
2. **Location List**: Clickable list of all clinic branches
3. **Google Maps Integration**: Direct links to Google Maps for directions

## 🔒 Security Notes

- The Mapbox access token is used only for client-side geocoding and map display
- No sensitive data is sent to Mapbox
- The token is safe to use in client-side applications

## 🆘 Troubleshooting

### Map Not Loading
- Check that your Mapbox access token is correctly set in the `.env` file
- Ensure the token has the necessary permissions (public scopes are sufficient)
- Check your internet connection

### Locations Not Showing
- Verify that clinic addresses are in a format that can be geocoded
- Check the browser console for any geocoding errors
- The app will fall back to a list view if geocoding fails

### Performance Issues
- The map loads clinic locations asynchronously
- Large numbers of locations may take a moment to geocode
- Consider implementing caching for production use

## 📱 Mobile Support

The map component is fully responsive and works on mobile devices:
- Touch-friendly navigation controls
- Responsive marker sizing
- Mobile-optimized location list
- Touch gestures for map interaction

## 🎨 Customization

You can customize the map appearance by modifying:
- `src/utils/mapUtils.ts` - Map configuration and styling
- `src/components/ClinicMap.tsx` - Component layout and behavior
- Map styles can be changed in the `defaultMapConfig` object

## 📊 Free Tier Limits

Mapbox's free tier includes:
- 50,000 map loads per month
- 100,000 geocoding requests per month
- Sufficient for most small to medium applications

For higher usage, consider upgrading to a paid plan. 