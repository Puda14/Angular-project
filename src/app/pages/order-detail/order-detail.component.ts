import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/Order";
import {ActivatedRoute} from "@angular/router";
import {Review} from '../../models/Review';
import { ReviewService } from 'src/app/services/review.service';
import {UserService} from "../../services/user.service";
import {JwtResponse} from "../../response/JwtResponse";
import {Subscription} from "rxjs";
import {Role} from "../../enum/Role";

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

    constructor(private orderService: OrderService,
                private route: ActivatedRoute,
                private reviewService : ReviewService,
                private userService: UserService) {
    }
    currentUserSubscription: Subscription;
    name$;
    name: string;
    currentUser: JwtResponse;
    Role = Role;
    review = new Review();
    order$: Observable<Order>;

    reviewSuccessMessage : string;
    reviewFailMessage : string;

    ngOnInit() {
        // this.items$ = this.route.paramMap.pipe(
        //     map(paramMap =>paramMap.get('id')),
        //     switchMap((id:string) => this.orderService.show(id))
        // )
        this.currentUserSubscription = this.userService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.order$ = this.orderService.show(this.route.snapshot.paramMap.get('id'));
        this.review.rating = 5;
        this.review.comment = 'good';
    }

    writeReview(productId : number){
        this.review.productId=productId;
        this.reviewService.postReview(this.review).subscribe(response => {
            
            console.log('Đánh giá đã được gửi đi:', response);
            this.reviewSuccessMessage = 'Review Submitted!'
            setTimeout(() => {
                this.reviewSuccessMessage = null; // Xóa thông báo sau 3 giây
              }, 3000);
        }, error => {
            console.error('Lỗi khi gửi đánh giá:', error);
            this.reviewFailMessage = 'Review has been submitted!'
            setTimeout(() => {
                this.reviewFailMessage = null; // Xóa thông báo sau 3 giây
              }, 3000);
        });


    }

    isReviewModalOpen: boolean[] = [];

    openReviewModal(index: number) {
        this.isReviewModalOpen[index] = true;
    }

    closeReviewModal(index: number) {
        this.isReviewModalOpen[index] = false;
    }
}
