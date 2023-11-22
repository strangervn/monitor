import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { Product } from 'src/app/common/Product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  product!: Product;
  categories!:Category[];
  postForm: FormGroup;
  
  url: string = "data:image/jpeg;base64,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SyCESiXrwpIaKR6QRjxdJZByP8RJWWfNJDRSPSCMeLpLIURKJekQRePjkhopHpBGPF0lkNIH0iHooqs/OSGikekEY8XSWREgfSIeiiaIOHWSGikekEY8XT2hbfXZNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpTaU2lNpVhvCZ/8r3r2drbVI9IIx4o1I9IIB+0M/tkaoooooooooooooooooooooooooooooooooooooooooooooooooooooooootqZwGgkhGp+CSEan4JIRqfgkh5f8Qmgm9um9um9um9uiACAg3EeVPwSQgDWHDyp+CSHlhCmbYtXKreVVvKq3lVbyu6VtjaxsHlT8EkI1PwSQjU/BO8hlGht/vBbWsrTeE0VmlmlmlmlmlmlmlmlmlmlmlmlmlmlmlmlmlmlmlmkHHSxIE9vpMLZMLZMLZMLZMLZMLZMLZMLZMLZMLZMLZMLZW4Al2WH7WaWaWaWaWaWaWaWaWaWaWaWaWaWaWaWaWaWaWaWaQOfX7QgtPco0LGeO9AXq2hHd/wB/ny3Ig3jcyz7/UOzCX6hybJ/MUERaCPRVsAdgYD+nCBCAAdyT6R7YPdZ4Ddz9/Pdq/f9ByNB+mn4gvACaGvMlsFvW3XdvvwLDkp8CDaEHg3No/YO96IAICDcR+k3qCFvdH16+0Z9CCO99nt/gWZAGU/D/wBSgP7cKNg8Ps+1w/ViAyj7vDIj1+jWAQrcS7jE/uCO9+0u0k+OdiH+DgR7CFm4bD9EIEJNgF6JgSd3eh6H0LB5Ny5l6tAIGRH3+iEAiw9wn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7sn7srvsgwj7/4r//aAAwDAQACAAMAAAAQ888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888884AwwwwwwwwwwwwwwwwwwwwwwwwwwwR88888888888888888+Cyyyyyyyyyyyyyyyyyyyyyyyyyyyc88888888888888888+DADDDDDDDDDDDDDDDDDDDDDDDDDD888888888888888888+DAQJDDDDDDDDDDDDDDDDDDDDDDDD888888888888888888+DAAQtDDDDDDDDDDDDDDDDDDDDDDD888888888888888888+DAAAQkLDDDDDDDDDDDDDDDDDDDDD888888888888888888+DAAAAA2PDDDDDDDDDDDDDDDDDDDD888888888888888888+DAAAAAAApLDDDDDDDDDDDDDDDDDD888888888888888888+DAAAAAAAAiJDDDDDDDDDDDDDDDDD888888888888888888+DAAAAAAAAAQ2HDDDDDDDDDDDDDDD888888888888888888+DAAAAAAAAAAAAyHDDDDDDDDDDDDD888888888888888888+DAAAAAAAAAAAAAQyNLDDDDDDDDDD888888888888888888+DAAAAAAAAAAAAAAAAAAHDDDDDDDD888888888888888888+DAAAAAAAAAAAAAAAAAAQipLDDDDD888888888888888888+DAAAAAAAAAAAAAAAAAAAAAAwyNDD888888888888888888+Qzzzzzzzzzzzzzzzzzzzzzzzzzzh08888888888888888849999999999999999999999999999r88888888888888888o9999999999999999999999999999p88888888888888888o9999999999999wyz999999999999p88888888888888888o9999999999999vMN999999999999p88888888888888888o9999999999999999999999999999v888888888888888888c8888888888yxxxxxz8888888888v8APPPPPPPPPPPPPPPPPPPPPPPPPPPPwAAAAAEHfPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPO44wAAAAAAMNNPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPKAAAAAAAAAAAEvPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPLDzzzzzzzzzzzz/ADzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz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";

  @Input() id!:number;
  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal, private categoryService: CategoryService, private productService: ProductService, private toastr: ToastrService) {
    this.postForm = new FormGroup({
      'productId': new FormControl(0),
      'name': new FormControl(null, [Validators.minLength(6), Validators.required]),
      'quantity': new FormControl(null, [Validators.min(1), Validators.required]),
      'price': new FormControl(null, [Validators.required, Validators.min(100000)]),
      'discount': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      'image': new FormControl(),
      'description': new FormControl(null, Validators.required),
      'enteredDate': new FormControl(new Date()),
      // 'rate': new FormControl(0),
      'categoryId': new FormControl(1)
    })
  }

  ngOnInit(): void {
    this.getCategories();
    this.productService.getOne(this.id).subscribe(data=>{
      this.product = data as Product;
      this.postForm = new FormGroup({
        'productId': new FormControl(this.product.productId),
        'name': new FormControl(this.product.name, [Validators.minLength(6), Validators.required]),
        'quantity': new FormControl(this.product.quantity, [Validators.min(1), Validators.required]),
        'price': new FormControl(this.product.price, [Validators.required, Validators.min(100000)]),
        'discount': new FormControl(this.product.discount, [Validators.required, Validators.min(0), Validators.max(100)]),
        'image': new FormControl(this.product.image),
        'description': new FormControl(this.product.description, Validators.required),
        'enteredDate': new FormControl(this.product.enteredDate),
        // 'rate': new FormControl(this.product.rate),
        'categoryId': new FormControl(this.product.category.categoryId)
      })
      this.url = this.product.image;
    }, error=>{
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: "lg" });
  }

  getCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data as Category[];
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
    })
  }

  update() {
    if(this.postForm.valid) {
      this.product = this.postForm.value;
      this.product.status = true;
      this.product.category = new Category(this.postForm.value.categoryId, '');
      this.product.image = this.url;
      this.productService.put(this.id, this.product).subscribe(data=>{
        this.modalService.dismissAll();
        this.toastr.success('Cập nhật thành công!', "Hệ thống");
        this.editFinish.emit('done');
      },error=>{
        this.toastr.error('Thêm thất bại!'+error, 'Hệ thống');
      })
    } else {
      this.toastr.error('Hãy kiểm tra và nhập lại dữ liệu!', 'Hệ thống');
    }
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}