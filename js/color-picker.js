// DevFusion - Color Picker Module

class ColorPickerModule {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateColor('#3b82f6');
    }

    setupEventListeners() {
        const colorInput = document.getElementById('colorInput');
        colorInput.addEventListener('input', (e) => this.updateColor(e.target.value));
        colorInput.addEventListener('change', (e) => this.updateColor(e.target.value));

        // Color value inputs
        ['hexValue', 'rgbValue', 'hslValue'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('focus', function() {
                    this.select();
                });
            }
        });
    }

    updateColor(hex) {
        document.getElementById('colorInput').value = hex;
        document.getElementById('colorPreview').style.backgroundColor = hex;

        const rgb = DevFusionUtils.hexToRgb(hex);
        if (!rgb) return;

        const hsl = DevFusionUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);

        // Update displays
        document.getElementById('hexValue').value = hex.toUpperCase();
        document.getElementById('rgbValue').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        document.getElementById('hslValue').value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        // Update color swatches
        this.updateShades(hex);
        this.updateComplementary(hex);
    }

    updateShades(hex) {
        const shades = DevFusionUtils.getColorShades(hex, 8);
        let html = '';

        shades.forEach((shade, idx) => {
            html += `
                <div class="color-swatch" style="background-color: ${shade};" title="${shade}" onclick="navigator.clipboard.writeText('${shade}')">
                    <div class="swatch-label">${Math.round((idx + 1) * (100 / 9))}%</div>
                </div>
            `;
        });

        document.getElementById('shadePalette').innerHTML = html;
    }

    updateComplementary(hex) {
        const complementary = DevFusionUtils.getComplementaryColor(hex);
        const analogous1 = this.rotateHue(hex, 30);
        const analogous2 = this.rotateHue(hex, -30);

        let html = `
            <div class="color-swatch" style="background-color: ${hex};" title="${hex}" onclick="navigator.clipboard.writeText('${hex}')">
                <div class="swatch-label">Primary</div>
            </div>
            <div class="color-swatch" style="background-color: ${complementary};" title="${complementary}" onclick="navigator.clipboard.writeText('${complementary}')">
                <div class="swatch-label">Comp</div>
            </div>
            <div class="color-swatch" style="background-color: ${analogous1};" title="${analogous1}" onclick="navigator.clipboard.writeText('${analogous1}')">
                <div class="swatch-label">Ana +</div>
            </div>
            <div class="color-swatch" style="background-color: ${analogous2};" title="${analogous2}" onclick="navigator.clipboard.writeText('${analogous2}')">
                <div class="swatch-label">Ana -</div>
            </div>
        `;

        document.getElementById('complementaryPalette').innerHTML = html;
    }

    rotateHue(hex, degrees) {
        const rgb = DevFusionUtils.hexToRgb(hex);
        if (!rgb) return hex;

        const hsl = DevFusionUtils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        hsl.h = (hsl.h + degrees + 360) % 360;

        return DevFusionUtils.hslToHex(hsl.h, hsl.s, hsl.l);
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.colorPickerModule = new ColorPickerModule();
});