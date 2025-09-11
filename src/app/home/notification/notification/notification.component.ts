import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IconDirective, IconService } from '@ant-design/icons-angular';
import { CheckCircleOutline, GiftOutline, MessageOutline, SettingOutline, PhoneOutline, LogoutOutline, UserOutline, EditOutline, ProfileOutline, QuestionCircleOutline, LockOutline, CommentOutline, UnorderedListOutline, ArrowRightOutline, BellOutline, GithubOutline, WalletOutline } from '@ant-design/icons-angular/icons';
import { ApiService } from 'src/app/service/api/api.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from "moment";
import 'moment/locale/fr';
moment.locale('fr');

@Component({
  selector: 'app-notification',
  imports: [NgClass, DatePipe, IconDirective, FullCalendarModule, NgIf],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  loading_get_notification = false;
  les_notifications: any[] = [];
  events: any[] = [];
  private iconService = inject(IconService);
  calendarOptions: CalendarOptions = {
    locale: 'fr',
    plugins: [dayGridPlugin],
    weekends: true,
    selectable: true,
    height: 'auto',
    displayEventTime: false,
    slotDuration: '00:30:00',
    slotLabelInterval: '01:00',
    dayMaxEventRows: 1,
    dayMaxEvents: true,
    firstDay: 1,
    eventClick: this.onEventClick.bind(this),
    events: this.events,
    datesSet: (info) => this.handleDatesSet(info)
  };
  notification_selectionnee: any;
  @ViewChild('modalNotification') modalNotification: any;
  lastSoundTime: number = 0;
  constructor(public api: ApiService, public route: Router, private modalService: NgbModal) {
    // this.windowWidth = window.innerWidth;
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
    this.calendarOptions.eventContent = (arg: any) => {
      return {
        html: `<span style="font-size: 0.8rem;">${arg.event.title}</span>`
      };
    };

  }
  ngOnInit(): void {
    this.get_notification();
  }

  get_notification() {
    this.loading_get_notification = true;

    this.api.taf_post("notification/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_notifications = reponse.data
        this.events = this.notifications_calendar(this.les_notifications);
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...this.events]
        };
        this.api.badge.set(this.les_notifications.filter((one: any) => one.lue == 0).length);
        //pour le son de notification
        const nouvelles_non_lues = this.les_notifications.filter((one: any) => one.lue == 0);
        if (nouvelles_non_lues.length > 0) {
          this.playNotificationSound();
        }
        // this.les_rappel_facturations = reponse.data.les_rappel_facturations
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
        //  this.badge=this.les_notifications.length;
        this.api.badge.set(this.les_notifications.filter((one: any) => one.lue == 0).length);
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

  onDateClick(event: any) {
    console.log("date click", event)
  }

  onEventClick(event: any) {
    let demande = event.event._def.extendedProps.demande;
    // this.openModalDetail(commande)
    // this.openModal_details_demande_conges(demande)
    console.log("event click", event)
    this.notification_selectionnee = event.event.extendedProps;
    this.modalService.open(this.modalNotification, { centered: true });
  }

  handleDatesSet(info: any) {
    console.log("info", info);
    const date = new Date(info.view.currentStart);
    // this.date_debut = moment(date).startOf('M').format("DD-MM-YYYY");
    // this.date_fin = moment(date).endOf('M').format("DD-MM-YYYY");
    // console.log("Mois sélectionné debut :", this.date_debut);
    // console.log("Mois sélectionné fin:", this.date_fin);
    // this.get_commandes();
  }

  notifications_calendar(notifs: any[]): any[] {
    return notifs.map(notif => ({
      title: ((notif?.type == "suivi_facture") ? "Suivi Facture " : "Rappel Facture ") + ((notif.lue) ? '<i class="bi bi-check2-all text-black fw-bold"> Vu</i>' : ""),
      start: notif.date_echeance,
      color: notif.type === 'rappel_facturation' ? '#ffc107' : '#17a2b8',
      extendedProps: notif
    }));
  }

  playNotificationSound() {
    const now = Date.now();
    if (now - this.lastSoundTime < 3000) return; // attendre 3 sec entre 2 sons
    this.lastSoundTime = now;
    const audio = new Audio('sound/not.wav');
    audio.play();
  }

  moment_format(date: any) {
    return moment(date).format('dddd D MMMM YYYY');
  }
}
