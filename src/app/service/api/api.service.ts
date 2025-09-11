import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IdbService } from '../idb/idb.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  local_storage_prefixe = "solener.angular";
  taf_base_url = "https://solener.sentech.tech/taf/";
  //  taf_base_url = "http://localhost/solener.php/";

  network: any = {
    token: undefined,
    status: true,
    message: "Aucun probléme détecté",
  }
  token: any = {
    token_key: null,
    token_decoded: null,
    user_connected: null,
    is_expired: null,
    date_expiration: null
  }
  menu: any[] = []
  id_projet = signal("0");
  les_avenants = signal([]);
  les_avenant_factures = signal([]);
  badge = signal(0);
  constructor(private http: HttpClient, private route: Router, private idb: IdbService, public _location: Location) { }
  // sauvegardes
  async get_from_local_storage(key: string): Promise<any> {
    try {
      let res: any = await this.idb.get_from_indexedDB(key)
      return res
    } catch (error) {
      console.error("erreur de recuperation", error)
      return null
    }
  }
  async save_on_local_storage(key: string, value: any): Promise<void> {
    await this.idb.save_on_indexedDB(key, value);
  }
  async delete_from_local_storage(key: string) {
    await this.idb.delete_from_indexedDB(key);
  }

  async get_token() {
    //le token n'est pas encore chargé
    if (this.network.token == undefined) {
      this.network.token = await this.get_from_local_storage("token")
      if (this.network.token != undefined && this.network.token != null) {// token existant
        this.update_data_from_token()// mise a jour du token
      }
    } else {// token dèja chargé
      this.update_data_from_token()// mise a jour du token
    }
    return this.network.token
  }
  //les requetes http
  async taf_get(path: string, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };

    this.http.get(api_url, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_get_error(error, on_error)
      }
    )
  }
  on_taf_get_error(error: any, on_error: Function) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async taf_post(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };
    this.http.post(api_url, data_to_send, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  async taf_post_login(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;

    this.http.post(api_url, data_to_send).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  on_taf_post_error(error: any, on_error: any) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async update_data_from_token() {
    let token_key = await this.get_from_local_storage("token")
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token_key);
    const expirationDate = helper.getTokenExpirationDate(token_key);
    const isExpired = helper.isTokenExpired(token_key);

    this.token = {
      token_key: token_key,
      token_decoded: decodedToken,
      user_connected: decodedToken.taf_data,
      is_expired: isExpired,
      date_expiration: expirationDate
    }
    if (this.token.is_expired) {
      this.on_token_expire()
    }
  }
  on_token_expire() {
    this.Swal_info("Votre session s'est expiré! Veuillez vous connecter à nouveau")
    this.delete_from_local_storage("token")
    this.route.navigate(['/public/login'])
  }

  Swal_success(title: any) {
    let succes = Swal.fire({
      title: title,
      icon: "success",
      timer: 700
    });
    return succes
  }

  Swal_error(title: any) {
    let error = Swal.fire({
      title: title,
      icon: "error",
      timer: 700
    });
    return error
  }
  Swal_info(title: any) {
    let info = Swal.fire({
      title: title,
      icon: "info",
      timer: 700
    });
    return info
  }
  Swal_confirm(title: string, options: { confirmButtonText: string; cancelButtonText: string }) {
    return Swal.fire({
      title: title,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: options.cancelButtonText,
      icon: 'question'
    });
  }

  full_menu: any[] = [
    {
      menu_header: "- Tableau de bord",
      items: [
        {
          text: "Dashboard",
          path: "/home/dashboard",
          icone: "bi bi-speedometer2",
          privileges: [1, 2],
          items: []
        },
      ]
    },

    {
      menu_header: "- Gestion des projets",
      items: [
        {
          text: "Projets",
          path: "/home/projet",
          icone: "bi bi-file-text",
          privileges: [1, 2],
          items: []
        },
        {
          text: "Clients",
          path: "/home/client",
          icone: "bi bi-people",
          privileges: [1, 2],
          items: []
        },
        {
          text: "Partenaires",
          path: "/home/partenaire",
          icone: "bi bi-link-45deg",
          privileges: [1, 2],
          items: []
        }
      ]
    },

    {
      menu_header: "- Paramétrages",
      items: [
        {
          text: "Utilisateur",
          path: "/home/utilisateur",
          icone: "bi bi-person-circle",
          privileges: [],
          aff: true,
          items: [],
          actions: [
            { id: "utilisateur.list", nom: "Lister les utilisateurs" },
            { id: "utilisateur.add", nom: "Ajouter un utilisateur" },
            { id: "utilisateur.edit", nom: "Modifier un utilisateur" },
            { id: "utilisateur.delete", nom: "Supprimer un utilisateur" },
          ],
        },

        {
          text: "Notification",
          path: "/home/notification",
          icone: "bi bi-bell",
          privileges: [],
          aff: true,
          items: [],
          actions: [
            { id: "profil.list", nom: "Lister les profils" },
          ],
        },
        {
          text: "Profil",
          path: "/home/profil",
          icone: "bi bi-person-badge",
          privileges: [],
          aff: true,
          items: [],
          actions: [
            { id: "profil.list", nom: "Lister les profils" },
          ],
        },

      ]
    }
  ];


  can(action: string): boolean {
    let id_type_utilisateur = +this.network.user_connected.id_privilege || 0
    if (this.les_droits[action] && this.les_droits[action].indexOf(id_type_utilisateur) != -1) {
      return true
    } else {
      return false
    }
  }

  les_droits: any = {
    // Gestion de la parti commerciale
    "produit.add": [1, 5, 6, 8],
    "produit.edit": [1, 5, 6, 8],
    "stock.add": [1, 5, 8],
    "stock.edit": [1, 5, 8],
    "vente.add": [1, 5, 6, 8, 9],
    "vente.edit": [1, 5, 6, 8, 9],
    "vente.chiffrage": [1, 5],
    "vente.acompte": [1, 7, 5, 6],
  };


  custom_menu() {
    if (this.menu.length > 0) return; // ✅ évite de le recalculer deux fois

    let id_privilege = this.token.token_decoded.taf_data.id_privilege || 0;
    this.menu = this.full_menu.map((one: any) => {
      let res = Object.assign({}, one);
      res.items = one.items.filter((one_item: any) => {
        let is_vide = one_item.privileges.length == 0;
        let es_dans_privileges = one_item.privileges.indexOf(id_privilege) != -1;
        return is_vide || es_dans_privileges;
      });
      return res;
    }).filter((one: any) => one.items.length > 0);

    console.log("menu filtré :", this.menu);
  }

  preference: any = {
    atlas: {
      filter: {
        region: {
          show: true,
          region: 1,
        },
        zone: {
          show: true,
        },
        domaine: {
          show: true,
        },
        unite_occupante: {
          show: true,
        },
        projet: {
          show: true,
        },
        batiment: {
          show: true,
        },
      },
    },
    phase: {
      filter: {
        to_edit: false,
        to_tableau: true,
      }
    },
    execution: {
      filter: {
        to_edit: false,
        to_tableau: true,
      }
    },
    detail_projet: {
      filter: {
        show_demande_travaux: true,
        show_budgetisation: true,
        show_execution: true,
      }
    },
    list_projet: {
      filter: {
        text: [],
        group_by: 'zone'
      }
    }
  };

  retour() {
    this._location.back()
  }

  format_date(date_string: string) {
    return {
      full: moment(date_string).locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
      jma: moment(date_string).locale("fr").format("Do MMMM YYYY"),// jeudi ...
      jma2: moment(date_string).locale("fr").format("DD-MM-YYYY"),// 01-11-2023
      jma2_hour: moment(date_string).locale("fr").format("DD-MM-YYYY à HH:mm"),// 01-11-2023
      jma3: moment(date_string).locale("fr").format("YYYY-MM-DD"),// 2023-10-21
      jma3_hour: moment(date_string).locale("fr").format("YYYY-MM-DD HH:mm"),// 2023-10-21 14:50
      full_datetime: moment(date_string).locale("fr").format("dddd Do MMMM YYYY à HH:mm"),// 27 février 2023
    }
  }
  format_current_date() {
    return {
      full: moment().locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
      jma: moment().locale("fr").format("Do MMMM YYYY"),// jeudi ...
      jma2: moment().locale("fr").format("DD-MM-YYYY"),// 01-11-2023
      jma3: moment().locale("fr").format("YYYY-MM-DD"),// 2023-10-21
      jma3_hour: moment().locale("fr").format("YYYY-MM-DD HH:mm"),// 2023-10-21 14:50
      full_datetime: moment().locale("fr").format("dddd Do MMMM YYYY à HH:mm"),// 27 février 2023
    }
  }

  formatNumber(value: any): string {
    if (!value || isNaN(Number(value))) {
      return value; // Retourne la valeur telle quelle si elle est null, vide ou non numérique
    }
    return Number(value).toLocaleString('fr-FR'); // Utilise Number.toLocaleString pour formater le nombre
  }

  is_already_selected(id: any, form: any, condition: string) {//la fonction désactive les options déja sélectionné dans le select
    let is_in = form.filter((one_detail: any) => one_detail[condition] == id)[0]?.[condition];
    return is_in;
  }

  duree_en_mois(date_debut: any, date_fin: any) {
    return moment(date_fin).diff(moment(date_debut), 'month');
  }
  update_preference(key: string, value: any) {
    this.preference[key] = value;
    this.save_on_local_storage("preference", this.preference);
  }
  go_back() {
    this._location.back();
  }

  get_relative_date(date: string): string {
    const now = moment();
    const target = moment(date);

    if (target.isAfter(now)) {
      return 'Arrive à échéance dans ' + target.fromNow(true); // true = sans "dans"
    } else {
      return 'Est arrivé à échéance il y a ' + target.fromNow(true);
    }
  }
}
