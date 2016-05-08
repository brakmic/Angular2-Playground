import { Component } from "@angular/core";
import bows from "bows";

const log: any = bows("AppComponent");

@Component({
  selector: "ang2-app",
  templateUrl: "app/templates/app.template.html",
})
export class AppComponent {

  private appname: string  = "ng2Playground";
  private userText: string = "Test Data-Binding";
  private userDate: string = undefined;

  constructor() {
    log("Init");
    this.userDate = (new Date()).toString();
  }

  public writeLog(): void {
    let date: Date = new Date();
    this.userDate = `[CLICK] : ${date.toString()}`;
  }
}
