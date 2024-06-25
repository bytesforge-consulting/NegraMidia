import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap, catchError, throwError } from "rxjs";
import { SpinnerService } from "../services/spinner-service.service";

@Injectable({
  providedIn: 'root'
})
export class RequestLoadingInterceptor implements HttpInterceptor {
    constructor(private spinnerService : SpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        this.spinnerService.show();

        return next.handle(req)
        .pipe(tap(((event: HttpEvent<any>) =>{
          if(event instanceof HttpResponse)
            this.spinnerService.hide();
        })),
        catchError(err => {
          this.spinnerService.hide();
          return throwError(() => err);
        }));
    }
}
