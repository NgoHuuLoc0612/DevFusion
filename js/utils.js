// DevFusion - Utility Functions

class DevFusionUtils {
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    static copyToClipboard(text) {
        return navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!', 'success', 2000);
            return true;
        }).catch(() => {
            this.showToast('Failed to copy', 'error', 2000);
            return false;
        });
    }

    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    static calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 100;
        
        const editDistance = this.getEditDistance(longer, shorter);
        return ((longer.length - editDistance) / longer.length) * 100;
    }

    static getEditDistance(s1, s2) {
        const costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                } else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    static formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    static generateUUID(version = 'v4') {
        if (version === 'v4') {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        // v1 - timestamp based
        const now = new Date();
        const timestamp = Math.floor(now.getTime() / 1000).toString(16).padStart(12, '0');
        const clockSeq = Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0');
        const node = Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
        return `${timestamp.slice(0, 8)}-${timestamp.slice(8, 12)}-1${clockSeq.slice(1, 4)}-${clockSeq}-${node}`;
    }

    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    static getComplementaryColor(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;
        
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        hsl.h = (hsl.h + 180) % 360;
        
        return this.hslToHex(hsl.h, hsl.s, hsl.l);
    }

    static hslToHex(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;
        
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return this.rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    }

    static getColorShades(hex, count = 5) {
        const shades = [];
        const rgb = this.hexToRgb(hex);
        if (!rgb) return shades;
        
        for (let i = 0; i < count; i++) {
            const shade = (i + 1) * (100 / (count + 1));
            const factor = shade / 100;
            const r = Math.round(rgb.r * factor);
            const g = Math.round(rgb.g * factor);
            const b = Math.round(rgb.b * factor);
            shades.push(this.rgbToHex(r, g, b));
        }
        return shades;
    }

    static parseJWT(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        try {
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            const signature = parts[2];

            return { header, payload, signature };
        } catch (error) {
            throw new Error('Failed to decode JWT: ' + error.message);
        }
    }

    static validateJSON(jsonString) {
        try {
            JSON.parse(jsonString);
            return { valid: true, error: null };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    static formatJSON(jsonString, indent = 2) {
        try {
            return JSON.stringify(JSON.parse(jsonString), null, indent);
        } catch (error) {
            return jsonString;
        }
    }

    static minifyJSON(jsonString) {
        try {
            return JSON.stringify(JSON.parse(jsonString));
        } catch (error) {
            return jsonString;
        }
    }

    static compareJSONObjects(obj1, obj2, path = '') {
        const differences = [];
        
        const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
        
        for (const key of allKeys) {
            const currentPath = path ? `${path}.${key}` : key;
            const val1 = obj1?.[key];
            const val2 = obj2?.[key];

            if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
                    differences.push(...this.compareJSONObjects(val1, val2, currentPath));
                } else {
                    differences.push({
                        path: currentPath,
                        oldValue: val1,
                        newValue: val2,
                        type: val1 === undefined ? 'added' : val2 === undefined ? 'removed' : 'modified'
                    });
                }
            }
        }
        
        return differences;
    }

    static debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    static throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                return func.apply(this, args);
            }
        };
    }

    static escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    static unescapeHtml(text) {
        const map = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#039;': "'"
        };
        return text.replace(/&[a-z]+;/g, m => map[m] || m);
    }

    static base64Encode(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    static base64Decode(str) {
        return decodeURIComponent(escape(atob(str)));
    }

    static urlEncode(str) {
        return encodeURIComponent(str);
    }

    static urlDecode(str) {
        return decodeURIComponent(str);
    }

    static htmlEntitiesEncode(str) {
        return str.replace(/./gm, s => `&#${s.charCodeAt(0)};`);
    }

    static htmlEntitiesDecode(str) {
        return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevFusionUtils;
}