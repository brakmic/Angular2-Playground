import { Component } from "@angular/core";

@Component({
  selector: "ang2-app",
  templateUrl: "../templates/app.template.html",
})
export class AppComponent {

  private appname: string  = "ng2Playground";
  private userText: string = "Test Data-Binding";
  private userDate: string = undefined;

  constructor() {
    this.userDate = (new Date()).toString();
  }

  public writeLog(): void {
    let date: Date = new Date();
    this.userDate = `[CLICK] : ${date.toString()}`;
  }
}
