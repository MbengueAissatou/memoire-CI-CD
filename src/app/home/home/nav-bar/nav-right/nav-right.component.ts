// angular import
import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';

// project import

// icon
import { IconService, IconDirective } from '@ant-design/icons-angular';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline
} from '@ant-design/icons-angular/icons';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-nav-right',
  imports: [IconDirective, RouterModule, NgScrollbarModule, NgbNavModule, NgbDropdownModule, CommonModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  private iconService = inject(IconService);

  styleSelectorToggle = input<boolean>();
  Customize = output();
  windowWidth: number;
  screenFull: boolean = true;

  constructor(public api: ApiService, public route: Router) {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline
      ]
    );
  }
  les_suivi_factures: any[] = [];
  les_rappel_facturations: any[] = [];
  les_notifications: any[] = [];
  loading_get_notification = false;
  badge=0;

  profile = [
    // {
    //   icon: 'edit',
    //   title: 'Edit Profile'
    // },
    {
      icon: 'user',
      title: 'Profile'
    },
    // {
    //   icon: 'profile',
    //   title: 'Social Profile'
    // },
    // {
    //   icon: 'wallet',
    //   title: 'Billing'
    // }
  ];

  setting = [
    {
      icon: 'question-circle',
      title: 'Support'
    },
    {
      icon: 'user',
      title: 'Account Settings'
    },
    {
      icon: 'lock',
      title: 'Privacy Center'
    },
    {
      icon: 'comment',
      title: 'Feedback'
    },
    {
      icon: 'unordered-list',
      title: 'History'
    }
  ];
  ngOnInit(): void {
    this.get_notification();
  }
  get_notification() {
    this.loading_get_notification = true;
    this.api.taf_post("notification/get_insert", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_notifications = reponse.data
        // this.les_rappel_facturations = reponse.data.les_rappel_facturations
        this.api.badge.set(this.les_notifications?.length);
        console.log('notif', this.les_notifications)
        console.log("Opération effectuée avec succés sur la table notification. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table notification a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_notification = false;
    }, (error: any) => {
      this.loading_get_notification = false;
    })
  }

  aller_facture(notif: any) {
    // this.route.navigate(['/home/details_projet_notif', notif.id_projet, notif.id_facture]);
     this.api.taf_post("notification/etat_notification", { id_notification: notif.id_notification }, (reponse: any) => {
       if (reponse.status) {
         this.les_notifications = reponse.data;
         this.api.badge.set(this.les_notifications.length);
         this.route.navigate(['/home/details_projet_notif', notif.id_projet, notif.id_facture]);
         console.log(notif.id_projet, 'notif.id_projet');
         this.api.id_projet.set(notif.id_projet)
         this.get_notification();
       } else {
         this.api.Swal_error("Impossible de marquer comme lue");
       }
     }, (err: any) => {
       this.api.Swal_error("Erreur réseau");
     });
  }


}
