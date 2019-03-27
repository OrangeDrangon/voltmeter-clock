import { Gpio } from 'pigpio';

export class Clock {
  private secondsPin: Gpio;
  private minutesPin: Gpio;
  private hoursPin: Gpio;

  private intervalId: undefined | NodeJS.Timeout;

  public constructor(secondsPin: number, minutesPin: number, hoursPin: number) {
    this.secondsPin = new Gpio(secondsPin, { mode: Gpio.OUTPUT });
    this.minutesPin = new Gpio(minutesPin, { mode: Gpio.OUTPUT });
    this.hoursPin = new Gpio(hoursPin, { mode: Gpio.OUTPUT });

    this.intervalId = undefined;
  }

  private interval() {
    const date = new Date(Date.now());

    const dutyCycles = [
      Math.round(((date.getSeconds() * 1000) + date.getMilliseconds()) / 60000 * 255),
      Math.round(((date.getMinutes() * 60) + date.getSeconds()) / 3600 * 255),
      Math.round((((date.getHours() % 12 || 12) * 12) + date.getMinutes()) / 720 * 255),
    ];

    this.secondsPin.analogWrite(dutyCycles[0]);
    this.minutesPin.analogWrite(dutyCycles[1]);
    this.hoursPin.analogWrite(dutyCycles[2]);
  }

  public clearInterval() {
    if (this.intervalId === undefined) {
      throw new Error('Interval not running! Please start one before clearing the interval!');
    }
    clearInterval(this.intervalId);
  }

  public setInterval(timeout: number) {
    if (this.intervalId !== undefined) {
      throw new Error('Interval already running! Please clear before setting an interval!'
        + ` Interval ID: ${this.intervalId}`);
    }

    this.intervalId = setInterval(this.interval, timeout);
  }
}
