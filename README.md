# Time Picker

A lightweight, framework-agnostic time picker component that works with vanilla JavaScript, PHP applications, WordPress, Laravel, and any web project.

## Features

- 🚀 **Zero dependencies** - Pure vanilla JavaScript
- 🎨 **Customizable** - Easy CSS theming
- 📱 **Mobile friendly** - Touch and keyboard support
- ♿ **Accessible** - WCAG compliant
- 🌐 **Universal** - Works with PHP, Laravel, WordPress, etc.
- ⚡ **Lightweight** - < 5KB gzipped
- 🕐 **Flexible** - 12/24 hour formats

## Quick Start

### CDN Usage
```html
<link rel="stylesheet" href="https://unpkg.com/@w6d-io/time-picker/dist/time-picker.min.css">
<script src="https://unpkg.com/@w6d-io/time-picker/dist/time-picker.min.js"></script>

<input type="text" id="time-input" placeholder="Select time">

<script>
new TimePicker('#time-input', {
  format: '24h'
});
</script>
```

### NPM Installation

```bash
npm install @w6d-io/time-picker
```

### PHP Integration

```php
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="node_modules/@w6d-io/time-picker/dist/time-picker.css">
</head>
<body>
    <form method="POST" action="submit.php">
        <input type="text" name="meeting_time" id="meeting-time" required>
        <input type="submit" value="Save">
    </form>
    
    <script src="node_modules/@w6d-io/time-picker/dist/time-picker.js"></script>
    <script>
        new TimePicker('#meeting-time', {
            format: '12h',
            onChange: function(time) {
                console.log('Selected time:', time);
            }
        });
    </script>
</body>
</html>
```

### Laravel Blade

```blade
@section('styles')
<link rel="stylesheet" href="{{ asset('js/time-picker/time-picker.css') }}">
@endsection

<div class="form-group">
    <label for="appointment_time">Appointment Time</label>
    <input type="text" 
           name="appointment_time" 
           id="appointment_time" 
           class="form-control"
           value="{{ old('appointment_time', $appointment->time ?? '') }}">
</div>

@section('scripts')
<script src="{{ asset('js/time-picker/time-picker.js') }}"></script>
<script>
new TimePicker('#appointment_time', {
    format: '12h',
    defaultTime: '09:00'
});
</script>
@endsection
```

### WordPress Plugin Integration

```php
function enqueue_time_picker_assets() {
    wp_enqueue_style('time-picker', plugin_dir_url(__FILE__) . 'assets/time-picker.css');
    wp_enqueue_script('time-picker', plugin_dir_url(__FILE__) . 'assets/time-picker.js', [], '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_time_picker_assets');

function render_time_picker_shortcode($atts) {
    $atts = shortcode_atts([
        'name' => 'time_field',
        'format' => '12h',
        'default' => ''
    ], $atts);
    
    return sprintf(
        '<input type="text" name="%s" id="%s" value="%s" data-time-picker data-format="%s">',
        esc_attr($atts['name']),
        esc_attr($atts['name']),
        esc_attr($atts['default']),
        esc_attr($atts['format'])
    );
}
add_shortcode('time_picker', 'render_time_picker_shortcode');
```

### API Options

```javascript
new TimePicker(selector, {
    format: '12h',           // '12h' or '24h'
    defaultTime: '12:00',    // Default time value
    minTime: '09:00',        // Minimum selectable time
    maxTime: '17:00',        // Maximum selectable time
    step: 15,                // Time step in minutes
    placeholder: 'Select time',
    disabled: false,
    onChange: function(time) {
        // Callback when time changes
    }
});
```
### Browser Support

* Chrome 60+ 
* Firefox 55+ 
* Safari 11+ 
* Edge 79+ 
* IE 11+ (with polyfills)

### Development

```bash
git clone https://github.com/w6d-io/time-picker.git
cd time-picker
npm install
npm run dev
```
Open http://localhost:8080 to see examples.

### Examples

* Vanilla HTML 
* PHP Integration 
* Laravel Blade 
* WordPress Plugin

### License
MIT © w6d-io
