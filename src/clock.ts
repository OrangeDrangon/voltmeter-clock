import { Gpio } from 'pigpio';

export class Clock {
  private secondsPin: Gpio;
  private minutesPin: Gpio;
  private hoursPin: Gpio;

  private intervalId: undefined | NodeJS.Timeout;

  /**
   * Creates an instance of Clock.
   *
   * @param secondsPin - Pin number for seconds voltmeter
   * @param minutesPin - Pin number for minutes voltmeter
   * @param hoursPin - Pin number for hours voltmeter
   */
  public constructor(secondsPin: number, minutesPin: number, hoursPin: number) {
    this.secondsPin = new Gpio(secondsPin, { mode: Gpio.OUTPUT });
    this.minutesPin = new Gpio(minutesPin, { mode: Gpio.OUTPUT });
    this.hoursPin = new Gpio(hoursPin, { mode: Gpio.OUTPUT });

    this.intervalId = undefined;
  }
  /**
   * The function called in the interval that writes the voltage to the pins.
   * It calculates the proper voltage to output based on the current time.
   */
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
  /**
   * Stops the clock from refreshing and sets the clock to 00:00:00.
   *
   * @throws Will throw an error if an interval is not running.
   */
  public clearInterval() {
    if (this.intervalId === undefined) {
      throw new Error('Interval not running! Please start one before clearing the interval!');
    }
    clearInterval(this.intervalId);
    this.secondsPin.analogWrite(0);
    this.minutesPin.analogWrite(0);
    this.hoursPin.analogWrite(0);
  }
  /**
   * Starts the clock with a refresh timeout based on the parameter.
   *
   * @throws Will throw an error if an interval is running.
   * @param timeout - The delay between clock refeshes
   */
  public setInterval(timeout: number) {
    if (this.intervalId !== undefined) {
      throw new Error('Interval already running! Please clear before setting an interval!'
        + ` Interval ID: ${this.intervalId}`);
    }
    this.intervalId = setInterval(() => { this.interval(); }, timeout);
  }
}
