import { TWO_PI } from '../../../utils/const';

export default class River {
  constructor(x, y, r, perlin, ctx, color) {
    this.x = x + 5;
    this.y = y + 5;
    this.x2 = this.x;
    this.y2 = this.y;
    this.r = r * Math.PI;
    this.finished = false;
    this.timer = 0;
    this.color = color;
    this.perlin = perlin;
    this.ctx = ctx;
  }

  update() {
    let xv = Math.cos(
      this.perlin.noise(this.x * 0.01, this.y * 0.01) * (this.r * TWO_PI)
    );
    let yv = Math.sin(
      this.perlin.noise(this.x * 0.01, this.y * 0.01) * (this.r * TWO_PI)
    );
    let xt = this.x + xv;
    let yt = this.y + yv;
    let x2 = this.x2 - xv;
    let y2 = this.y2 - yv;
    let ctx = this.ctx;

    if (this.timer >= 800) {
      this.finished = true;
    }
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(xt, yt);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();

    ctx.restore();

    this.x2 = x2;
    this.y2 = y2;
    this.x = xt;
    this.y = yt;

    this.timer++;
  }
}
