import {Component} from '@angular/core';
import {NewYearService} from '../../services/new-year.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';

const aSecondInMs = 1000
const aMinuteInMs = 60 * aSecondInMs
const aHourInMs = 60 * aMinuteInMs
const aDayInMs = 24 * aHourInMs

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
  animations: [
    trigger('shownHidden', [
      state('shown', style({opacity: 1})),
      state('hiddenRight', style({opacity: 0, transform: 'translateX(100%)'})),
      state('hiddenLeft', style({opacity: 0, transform: 'translateX(-100%)'})),
      transition('* => *', [animate('2s ease-in-out')]),
    ]),
    trigger('videoOnOff', [
      state('videoOn', style({display: "block"})),
      state('videoOff', style({display: "none"})),
      transition('* => *', [animate('.5s ease-in-out')]),
    ])
  ],
})
export class CounterComponent {
  limitDate!: Date
  musicDate!: Date
  hasLimitTimeCome: boolean = false
  hasMusicTimeCome: boolean = false

  counterElement?: HTMLElement
  musicVideoElement?: HTMLVideoElement
  canvasElement?: HTMLCanvasElement
  canvasContext?: CanvasRenderingContext2D

  constructor(private newYearService: NewYearService, private router: Router) {
    const currentDate = new Date()
    this.limitDate = new Date(currentDate.getTime() + aSecondInMs * 240)

    // --- --- --- limitDate é meia-noite do primeiro dia do próximo ano --- --- ---
    // this.limitDate = new Date(currentDate.getTime() + aDayInMs * 366)
    // this.limitDate.setHours(0, 0, 0, 0)
    // this.limitDate.setDate(0)
    // this.limitDate.setMonth(0)
    // 2:24
    this.musicDate = new Date(this.limitDate.getTime() - aMinuteInMs * 3 - aSecondInMs * 44)

    addEventListener("DOMContentLoaded", () => {
      this.counterElement = document.querySelector("#time-counter") as HTMLElement
      this.updateTimeCounter()

      this.musicVideoElement = document.querySelector("video#music-video") as HTMLVideoElement
      this.musicVideoElement.loop = false

      this.musicVideoElement.addEventListener('loadeddata', () => {
        this.canvasElement!.width = this.musicVideoElement!.videoWidth;
        this.canvasElement!.height = this.musicVideoElement!.videoHeight;
      })

      this.musicVideoElement.addEventListener('play', this.applyChromaKey.bind(this));

      this.canvasElement = document.querySelector("canvas") as HTMLCanvasElement
      this.canvasContext = this.canvasElement.getContext('2d') as CanvasRenderingContext2D
    })

    setInterval(this.updateTimeCounter.bind(this), 500)
  }

  updateTimeCounter() {
    this.hasLimitTimeCome = this.hasLimitDateBeenReached()
    this.hasMusicTimeCome = this.hasMusicDateBeenReached()

    if (this.hasMusicTimeCome) {
      console.log("HAS COME!")
      this.musicVideoElement!.play()
    }

    if (this.hasLimitTimeCome) return null;

    const timeLeft = this.getTimeLeft()
    this.counterElement!.innerText = `${this.padWithZeros(timeLeft.hour)}:${this.padWithZeros(timeLeft.minute)}:${this.padWithZeros(timeLeft.second)}`

    return null;
  }

  hasLimitDateBeenReached() {
    const currentDate = new Date()
    return (this.limitDate.getTime() - currentDate.getTime()) <= 0
  }

  hasMusicDateBeenReached() {
    const currentDate = new Date()
    return (this.musicDate.getTime() - currentDate.getTime()) <= 0
  }

  getTimeLeft() {
    const currentDate = new Date()
    const timeLeftInMs = this.limitDate.getTime() - currentDate.getTime()

    return {
      second: Math.floor(timeLeftInMs / aSecondInMs) % 60,
      minute: Math.floor(timeLeftInMs / aMinuteInMs) % 60,
      hour: Math.floor(timeLeftInMs / aHourInMs) % 24,
    }
  }

  padWithZeros(n: number) {
    return n.toString().padStart(2, "0")
  }

  applyChromaKey() {
    this.canvasContext!.drawImage(this.musicVideoElement!, 0, 0, this.canvasElement!.width, this.canvasElement!.height);

    const frame = this.canvasContext!.getImageData(0, 0, this.canvasElement!.width, this.canvasElement!.height);
    const length = frame.data.length;

    // Define the chroma key color (green in this case)
    const chromaKeyColor = {r: 0, g: 0, b: 0};
    const threshold = 10; // Adjust for tolerance

    for (let i = 0; i < length; i += 4) {
      const r = frame.data[i];
      const g = frame.data[i + 1];
      const b = frame.data[i + 2];

      // Check if the pixel is close to the chroma key color
      if (
        Math.abs(r - chromaKeyColor.r) < threshold &&
        Math.abs(g - chromaKeyColor.g) < threshold &&
        Math.abs(b - chromaKeyColor.b) < threshold
      ) {
        // Make the pixel transparent
        frame.data[i + 3] = 0; // Set alpha channel to 0
      }
    }

    this.canvasContext!.putImageData(frame, 0, 0);
    requestAnimationFrame(this.applyChromaKey.bind(this));
  }
}
