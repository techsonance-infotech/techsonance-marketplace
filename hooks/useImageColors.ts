import { useState, useEffect } from 'react';

export function useImageColors(imageUrl: string | undefined) {
  const [colors, setColors] = useState<{
    bg: string;
    solidBg: string;
    dominant: string;
  }>({
    bg: 'rgb(15, 23, 42)', // Default slate-900
    solidBg: 'rgb(15, 23, 42)',
    dominant: 'rgb(15, 23, 42)'
  });

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Downscale to a small size to speed up processing
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);

        // Extract corner pixels (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
        const topLeft = ctx.getImageData(0, 0, 1, 1).data;
        const topRight = ctx.getImageData(49, 0, 1, 1).data;
        const bottomLeft = ctx.getImageData(0, 49, 1, 1).data;
        const bottomRight = ctx.getImageData(49, 49, 1, 1).data;

        // Calculate average colors for edges
        const rTop = Math.round((topLeft[0] + topRight[0]) / 2);
        const gTop = Math.round((topLeft[1] + topRight[1]) / 2);
        const bTop = Math.round((topLeft[2] + topRight[2]) / 2);
        const aTop = ((topLeft[3] + topRight[3]) / 2) / 255;

        const rBottom = Math.round((bottomLeft[0] + bottomRight[0]) / 2);
        const gBottom = Math.round((bottomLeft[1] + bottomRight[1]) / 2);
        const bBottom = Math.round((bottomLeft[2] + bottomRight[2]) / 2);
        const aBottom = ((bottomLeft[3] + bottomRight[3]) / 2) / 255;

        const rLeft = Math.round((topLeft[0] + bottomLeft[0]) / 2);
        const gLeft = Math.round((topLeft[1] + bottomLeft[1]) / 2);
        const bLeft = Math.round((topLeft[2] + bottomLeft[2]) / 2);
        const aLeft = ((topLeft[3] + bottomLeft[3]) / 2) / 255;

        const rRight = Math.round((topRight[0] + bottomRight[0]) / 2);
        const gRight = Math.round((topRight[1] + bottomRight[1]) / 2);
        const bRight = Math.round((topRight[2] + bottomRight[2]) / 2);
        const aRight = ((topRight[3] + bottomRight[3]) / 2) / 255;

        const topColorStr = `rgba(${rTop}, ${gTop}, ${bTop}, ${aTop > 0.1 ? aTop : 1})`;
        const bottomColorStr = `rgba(${rBottom}, ${gBottom}, ${bBottom}, ${aBottom > 0.1 ? aBottom : 1})`;
        const leftColorStr = `rgba(${rLeft}, ${gLeft}, ${bLeft}, ${aLeft > 0.1 ? aLeft : 1})`;
        const rightColorStr = `rgba(${rRight}, ${gRight}, ${bRight}, ${aRight > 0.1 ? aRight : 1})`;

        // Determine gradient direction by comparing vertical and horizontal variance
        const diffV = Math.abs(rTop - rBottom) + Math.abs(gTop - gBottom) + Math.abs(bTop - bBottom);
        const diffH = Math.abs(rLeft - rRight) + Math.abs(gLeft - gRight) + Math.abs(bLeft - bRight);

        // Solid background calculation for fallback and inset shadow
        const rBg = Math.round((rTop + rBottom) / 2);
        const gBg = Math.round((gTop + gBottom) / 2);
        const bBg = Math.round((bTop + bBottom) / 2);
        const aBg = (aTop + aBottom) / 2;
        const solidBgColor = `rgba(${rBg}, ${gBg}, ${bBg}, ${aBg > 0.1 ? aBg : 1})`;

        const maxVariance = Math.max(diffV, diffH);
        let bgStyle = '';

        if (maxVariance < 15) {
          bgStyle = solidBgColor;
        } else if (diffV >= diffH) {
          bgStyle = `linear-gradient(to bottom, ${topColorStr}, ${bottomColorStr})`;
        } else {
          bgStyle = `linear-gradient(to right, ${leftColorStr}, ${rightColorStr})`;
        }

        // Downscale to 1x1 to get the overall average/dominant color
        const canvas1x1 = document.createElement('canvas');
        const ctx1x1 = canvas1x1.getContext('2d');
        if (ctx1x1) {
          canvas1x1.width = 1;
          canvas1x1.height = 1;
          ctx1x1.drawImage(img, 0, 0, 1, 1);
          const [rDom, gDom, bDom, aDom] = ctx1x1.getImageData(0, 0, 1, 1).data;
          
          setColors({
            bg: bgStyle,
            solidBg: solidBgColor,
            dominant: `rgba(${rDom}, ${gDom}, ${bDom}, ${aDom / 255})`
          });
        }
      } catch (e) {
        console.warn('Canvas color extraction blocked or failed (possibly CORS):', e);
      }
    };
  }, [imageUrl]);

  return colors;
}
