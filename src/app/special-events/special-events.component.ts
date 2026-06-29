import * as bootstrap from 'bootstrap';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { FormBuilder,Validators } from '@angular/forms';
import { specialEventData } from './special-events.component.model';

@Component({
  selector: 'app-special-events',
  templateUrl: './special-events.component.html',
  standalone : false
})
export class SpecialEventsComponent implements OnInit 
{  
  specialEvents : any[] = []

  public fbobj = new FormBuilder();
  public formData : specialEventData = new specialEventData;
  public seatBtn = true;

  public id : number = 0 ;
  public IOT : number = 0;
  public IOS: number = 0;
  public Struts : number = 0;
  public Embedded : number = 0;
  public LSP: number = 0;
  public IOTWorkshop : number = 0;
  public batchName : String = "Batch";
  public objId : number = 0;


  constructor(private _eventService: EventService,
              private _router: Router) { }


  eventForm = this.fbobj.group
  ({
    Firstname :['',[Validators.required,Validators.minLength(5),Validators.pattern('^[a-zA-Z ]+$')]],
    phone :['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
    email : ['', [Validators.required,Validators.email] ],
    prebatch :['',[Validators.required] ],
    RID :['',[Validators.required]],
    address : ['', [Validators.required]]
  });              

  ngOnInit() 
  {
    this._eventService.getSpecialEvents()
      .subscribe(
        res => this.specialEvents = res,
        err => {
          if( err instanceof HttpErrorResponse ) {
            if (err.status === 401) {
              this._router.navigate(['/login'])
            }
          }
        }
      )
  }

  count() : void
  {
    this._eventService.countSpecialUsers().subscribe(res =>{this.objId = res.count;});
  }

  clearForm() : any
  {
    return this.eventForm.reset();
  }

  isFornValid() : any
  {
    return this.eventForm.valid;
  }

    getEventname(name : any) : void
    {
        
      this.batchName = name;
      
      this._eventService.countSpecialBatches().subscribe(res => {
      this.IOT = res.IOT;
      this.LSP = res.LSP;
      this.IOS = res.IOS;
      this.Struts = res.Struts;
      this.IOTWorkshop = res.IOTWorkshop;
      this.Embedded = res.Embedded;
  
      switch (name) 
      {
        case "IOT Workshop":
          this.id = this.IOTWorkshop;
          if(this.IOTWorkshop >=10) 
          {
            this.seatBtn = false;  
          }
          else
          {
            this.seatBtn = true
          }
          break;
  
        case "IOS Internals":        
          this.id = this.IOS;
          if (this.IOS>=10) 
          {
            this.seatBtn = false;
          }
          else
          {
            this.seatBtn = true;
          }
          break;
  
          case "Struts":
            this.id = this.Struts;
            if (this.Struts >= 2) 
            {
              this.seatBtn = false;
            }
            else
            {
              this.seatBtn = true
            }
            break;
  
            case "IOT":
              this.id = this.IOT;
              if (this.IOT >= 10) 
              {
                this.seatBtn = false
              }
              else
              {
                this.seatBtn = true
              }
              break;
  
            case "Embedded Programming":
              this.id = this.Embedded
            if (this.Embedded >= 10) 
            {
              this.seatBtn = false;
            }
            else
            {
              this.seatBtn = true
            }
            break;
  
            case "LSP":
            this.id = this.LSP;
            if (this.LSP >= 10) 
            {
              this.seatBtn = false;
            }
            else
            {
              this.seatBtn = true
            }
            break;
  
          default:
            this.seatBtn = true;
          break;
      }
  
      const registrationForm = document.getElementById('registrtionForm');
      const batchFull = document.getElementById('BatchFull');
      
      if (registrationForm)
      {     
        const registrationFormmodal = new bootstrap.Modal(registrationForm);
        const batchFullmodal = new bootstrap.Modal(batchFull);
  
        if(this.seatBtn)
        {
          registrationFormmodal.show();
        }
        else
        {
          batchFullmodal.show();
        }
      }
  
      this.count();
  
    });
  
  
      return;      
    }
  

  insertData() : void
  { 
    this.count()

    this.formData.id = String(this.objId+1);
    this.formData.name = this.eventForm.value.Firstname;
    this.formData.email = this.eventForm.value.email;
    this.formData.mobile = this.eventForm.value.phone;
    this.formData.address = this.eventForm.value.address;
    this.formData.previousbatch = this.eventForm.value.prebatch;
    this.formData.batch = String(this.batchName);
    
    this._eventService.specialsubmitForm(this.formData).subscribe(res => {this.eventForm.reset()});
  }

  
}
