import Marsaglia from './Marsaglia';

export default class PerlinGenerator {
  constructor(seed) {
    let rnd = new Marsaglia(seed, (seed << 16) + (seed >> 16));
    let i;
    let j;
    this.perm = new Uint8Array(512);

    for (i = 0; i < 256; ++i) {
      this.perm[i] = i;
    }

    for (i = 0; i < 256; ++i) {
      let t = this.perm[j = rnd.intGenerator() & 0xFF];
      this.perm[j] = this.perm[i];
      this.perm[i] = t;
    }

    for (i = 0; i < 256; ++i) {
      this.perm[i + 256] = this.perm[i];
    }
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad2d(i, x, y) {
    let v = (i & 1) === 0 ? x : y;
    return (i & 2) === 0 ? -v : v;
  }

  noise2d(x, y) {
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    let fx = (3 - 2 * x) * x * x;
    let fy = (3 - 2 * y) * y * y;
    let p0 = this.perm[X] + Y;
    let p1 = this.perm[X + 1] + Y;
    return this.lerp(
      fy,
      this.lerp(fx, this.grad2d(this.perm[p0], x, y), this.grad2d(this.perm[p1], x - 1, y)),
      this.lerp(fx, this.grad2d(this.perm[p0 + 1], x, y - 1), this.grad2d(this.perm[p1 + 1], x - 1, y - 1))
    );
  }
}
