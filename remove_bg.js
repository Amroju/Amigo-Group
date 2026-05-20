const Jimp = require("jimp");

async function removeBackground() {
    try {
        const imagePath = "assets/yalla_amigo_transparent_.png";
        const image = await Jimp.read(imagePath);
        
        const targetColor = { r: 255, g: 255, b: 255 };
        const tolerance = 25; // to catch slight off-whites from jpeg compression

        const width = image.bitmap.width;
        const height = image.bitmap.height;

        const visited = new Set();
        const queue = [];

        const corners = [
            { x: 0, y: 0 },
            { x: width - 1, y: 0 },
            { x: 0, y: height - 1 },
            { x: width - 1, y: height - 1 }
        ];

        function isSimilar(color1, color2) {
            return Math.abs(color1.r - color2.r) <= tolerance &&
                   Math.abs(color1.g - color2.g) <= tolerance &&
                   Math.abs(color1.b - color2.b) <= tolerance;
        }

        for (const c of corners) {
            const idx = image.getPixelIndex(c.x, c.y);
            const r = image.bitmap.data[idx];
            const g = image.bitmap.data[idx + 1];
            const b = image.bitmap.data[idx + 2];
            
            if (isSimilar({r, g, b}, targetColor)) {
                queue.push(c);
                visited.add(`${c.x},${c.y}`);
            }
        }

        while (queue.length > 0) {
            const { x, y } = queue.shift();
            
            const idx = image.getPixelIndex(x, y);
            image.bitmap.data[idx + 3] = 0; // Alpha

            const neighbors = [
                { x: x + 1, y },
                { x: x - 1, y },
                { x, y: y + 1 },
                { x, y: y - 1 }
            ];

            for (const n of neighbors) {
                if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
                    const key = `${n.x},${n.y}`;
                    if (!visited.has(key)) {
                        visited.add(key);
                        const nIdx = image.getPixelIndex(n.x, n.y);
                        const nr = image.bitmap.data[nIdx];
                        const ng = image.bitmap.data[nIdx + 1];
                        const nb = image.bitmap.data[nIdx + 2];
                        const na = image.bitmap.data[nIdx + 3];

                        if (na > 0 && isSimilar({r: nr, g: ng, b: nb}, targetColor)) {
                            queue.push(n);
                        }
                    }
                }
            }
        }

        image.write(imagePath, () => {
            console.log("Background removed and saved successfully.");
        });
    } catch (e) {
        console.error("Error processing image:", e);
    }
}
removeBackground();
