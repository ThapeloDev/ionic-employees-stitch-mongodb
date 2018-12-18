import { Component, OnInit, HostListener } from '@angular/core';

import { PopoverController, ModalController } from '@ionic/angular';

import { ShowPeoplePopoverComponent } from './../popovers/show-people.popover';

import { StitchMongoService } from './../services/stitch-mongo.service';

import { ObjectId } from 'bson';

import { Storage } from '@ionic/storage';

import config from '../config/config';

import { EventModalComponent } from './../modals/event-modal/event.modal';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss']
})
export class SchedulePage implements OnInit {

  currentYear = new Date().getFullYear();
  events: any = null;
  participants: any = [];

  // https://www.code-sample.com/2018/07/angular-6-google-maps-agm-core.html
  lat = 26.765844;
  lng = 83.364944;
  innerWidth: any;
  countPeople = 3;
  avatarColSize = 2;
  chipColSize = 2;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // console.log(event.target.innerWidth);
    this.checkWidth(event.target.innerWidth);
    // this.people = this.peopleMore.slice(0, this.countPeople);
    this.participants = [];
    this.events.map(e => {
      const visibleParticipants = e.meeting_participants.slice(0, this.countPeople);
      this.participants.push(visibleParticipants);
    });
  }

  constructor(private popoverCtrl: PopoverController, private stitchMongoService: StitchMongoService,
              private storage: Storage, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.checkWidth(this.innerWidth);

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          if ((result.length !== 0) && (typeof result[0]['events'] !== 'undefined')) {
            this.events = result[0]['events'];
            this.events.map(event => {
              const visibleParticipants = event.meeting_participants.slice(0, this.countPeople);
              this.participants.push(visibleParticipants);
            });
          }
        });
      }
    });
  }

  onClickShowPeople(event) {
    console.log('SchedulePage::onClickShowPeople | method called');
    this.presentPopover(event);
  }

  async presentPopover(event) {
    const componentProps = { popoverProps: { people: event.meeting_participants}};
    const popover = await this.popoverCtrl.create({
      component: ShowPeoplePopoverComponent,
      componentProps: componentProps
      // event: event
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      this.popoverCtrl.dismiss();
    }

  }

  checkWidth(width) {

    // Extra small.
    if (width <= 400) {
      this.countPeople = 2;
      this.avatarColSize = 2;
      this.chipColSize = 2;
    }
    // Small.
    if ((width >= 401) && (width <= 640)) {
      this.countPeople = 3;
      this.avatarColSize = 2;
      this.chipColSize = 2;
    }
    // Medium.
    if ((width >= 641) && (width <= 1007)) {
      this.countPeople = 6;
      this.avatarColSize = 1;
      this.chipColSize = 6;
    }
    // Large.
    if ((width >= 1008) && (width <= 1199)) {
      this.countPeople = 8;
      this.avatarColSize = 1;
      this.chipColSize = 4;
    }
    // Extra Large.
    if (width >= 1200) {
      this.countPeople = 10;
      this.avatarColSize = 1;
      this.chipColSize = 2;
    }
  }

  addEvent() {
    console.log('SchedulePage::addEvent() | method called');
    this.presentModal();
  }

  async presentModal() {
    const componentProps = { modalProps: { title: 'Add event' }};
    const modal = await this.modalCtrl.create({
      component: EventModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }

}
