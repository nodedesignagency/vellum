// Astro's sharp image service with one change. A photo that is mostly flat and dark (a soft wall wash, one beam in an
// empty room) encodes to almost nothing at the default AVIF and WebP quality, and the encoder smooths away the fine
// texture that makes it read as sharp (review feedback: two project photos looked blurred; the old North Gallery card
// was a 9KB file). When an encoded photo comes out below MIN_BPP bits per pixel, it is encoded again at a higher
// quality. Detailed photos are already above it and are left exactly as they were. A `quality` set on an image wins.
import sharpService from 'astro/assets/services/sharp';
import { imageMetadata } from 'astro/assets/utils';
import type { LocalImageService } from 'astro';

const MIN_BPP = 0.2;
const RETRY: Record<string, number> = { avif: 75, webp: 90 };

const service: LocalImageService = {
  ...sharpService,
  async transform(input, options, config, logger) {
    const out = await sharpService.transform(input, options, config, logger);
    const quality = RETRY[out.format];
    if (!quality || options.quality !== undefined) return out;
    const { width, height } = await imageMetadata(out.data);
    if (!width || !height || (out.data.length * 8) / (width * height) >= MIN_BPP) return out;
    return sharpService.transform(input, { ...options, quality }, config, logger);
  },
};

export default service;
