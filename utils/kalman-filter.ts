export class KalmanFilter {
  private q: number; // Process noise covariance
  private r: number; // Measurement noise covariance
  private x: number; // Value
  private p: number; // Estimation error covariance
  private k: number; // Kalman gain

  constructor(q: number, r: number, initialValue: number) {
    this.q = q;
    this.r = r;
    this.x = initialValue; // Initial value
    this.p = 1; // Initial estimation error covariance
    this.k = 0;
  }

  update(measurement: number) {
    // Prediction update
    this.p += this.q;

    // Measurement update
    this.k = this.p / (this.p + this.r);
    this.x += this.k * (measurement - this.x);
    this.p *= 1 - this.k;

    return this.x;
  }
}
