import Swal, { SweetAlertResult } from "sweetalert2";
import { NotificationService } from "./notification.service";

describe('NotificationService', () => {

  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should show message', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve() as any);
    service.show('fake message');
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('should show message with question', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: false }));

    service.showQuestion('fake question?');

    expect(Swal.fire).toHaveBeenCalled();
  });
});
