<template>
    <div class="q-pa-sm">
        <div v-if="isLoading">
          <q-inner-loading :showing="true">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </div>
        <div v-else class="dialog__restaurant">
          <div class="row">
            <div class="col-md-8" style="margin-top: -34px">
              <h5 class="q-ml-lg text-weight-bolder">{{ restaurant }}
                <q-btn flat round class="q-mr-lg float-right">
                  <img @click="zuggriff(19, 2, 'getPrepare')" :src="require('~/app/icons/Icon-Refresh.svg')" height="30">
                    <q-tooltip>
                      Refresh
                    </q-tooltip>
                  </img>
                </q-btn>
              </h5>
              <div class="q-gutter-y-md">                
                <div class="row q-ml-xs items-start q-gutter-md q-mb-md scroll overflow" style="height: 220px">
                  <template v-for="datarow in dataFilteredSubGroup">
                    <q-card flat bordered class="my-card" 
                      style="width:240px" 
                      :key="datarow['zknr']" 
                      @click="onClickSubGroup(datarow)">
                      <q-card-section :class="(datarow['selected']) ? 'bg-cyan text-white':'bg-white text-black'">
                        {{datarow['bezeich']}}
                      </q-card-section>
                    </q-card>
                  </template>
                </div>                  
              </div>

              <div>
                <q-card class="q-ml-md searching-restaurant">
                  <div class="row justify-between items-center">
                    <div class="col-4 ">
                      <strong :style="{ fontSize: '22px' }">MENU</strong>
                    </div>
                    <div class="col-4">
                      <q-input
                        dark
                        dense
                        standout
                        v-model="text"
                        data-layout="compact" 
                        ref="searcharticle"
                        input-class="text-left"
                        class="q-ml-md"
                        @input="onChangeSearchInput(text)"
                        @focus="showKeyboardSearch"
                      >
                        <template v-slot:append>
                          <q-icon v-if="text === ''" name="mdi-magnify" />
                          <q-icon
                            v-else
                            name="mdi-window-close"
                            class="cursor-pointer"
                            @click="text = ''"
                          />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-card>
                <div class="q-pa-md row items-start scroll overflow" style="height: 220px">
                  <template v-for="datarow in dataFilteredArticle">
                    <q-card flat bordered
                      class="my-card q-mr-md q-mb-md" 
                      style="width:240px" 
                      :key="datarow['artnr']"
                      @click="onClickArticle(datarow)">
                      <q-card-section>
                        {{datarow['bezeich']}}
                      </q-card-section>
                    </q-card>
                  </template>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="q-ml-lg q-gutter-y-md row justify-between">
                  <q-btn @click="onClickTableTransfer" class="col" flat >
                    <q-img
                      class="img-collage"
                      src="../../icons/OU/collage/TableTransfer.svg"
                    >
                      <q-tooltip>
                        Table Transfer
                      </q-tooltip>
                    </q-img>
                  </q-btn>
                  <q-btn @click="onClickDialogSelectOrderTaker()" class="col" flat >
                    <q-img
                      class="img-collage"
                      src="../../icons/OU/collage/SelectOrderTakers.svg"
                    >
                      <q-tooltip>
                        Select Order Taker
                      </q-tooltip>
                    </q-img>
                  </q-btn>
                  <q-btn @click="onClickDiscount()" class="col" flat >
                    <q-img
                      class="img-collage"
                      src="../../icons/OU/collage/Discount.svg"
                    >
                      <q-tooltip>
                        Discount
                      </q-tooltip>
                    </q-img>
                  </q-btn>
                  <q-btn @click="flagPrintOrderCheckerEnable ? onClickPrintOrderChecker : null" class="col" flat >
                    <q-img
                      class="img-collage"
                      src="../../icons/OU/collage/PrintOrderChecker.svg"
                    >
                      <q-tooltip>
                        Print Order Checker
                      </q-tooltip>
                    </q-img>
                  </q-btn>
                  <q-btn class="col" flat >
                    <q-img
                      class="img-collage"
                      src="../../icons/OU/collage/rePrintBill1.svg"
                    >
                      <q-tooltip>
                        RePrint Bill
                      </q-tooltip>
                    </q-img>
                  </q-btn>
                  <q-btn @click="onClickPrintBill = true" class="col" flat >
                    <q-img
                      class="img-collage"
                      src="../../icons/OU/collage/BillPrint.svg"
                    >
                      <q-tooltip>
                        Bill Print
                      </q-tooltip>
                    </q-img>
                  </q-btn>

                <!-- <q-tabs
                  v-model="tabbill"
                  class="text-blue"
                  align="left"
                  :breakpoint="0"
                >
                  <q-tab class="tabcalc" name="calc" icon="mdi-calculator" />
                  <q-tab name="collage" icon="mdi-collage">
                    <q-tooltip>
                      More Options
                    </q-tooltip>
                  </q-tab>
                </q-tabs>

                <q-tab-panels v-model="tabbill" animated>
                  <q-tab-panel class="q-pa-none" name="calc">
                    <SInput autofocus v-model="qty" label-text="QTY" data-layout="numeric" ref="qtyRoomBox" @focus="showKeyboardQty"/>

                    <div class="row items-start">
                      <q-card flat class="numpad">
                        <q-card-section>
                          <vue-touch-keyboard
                            id="keyboard"
                            :options="options" 
                            layout="numeric"
                            :input="input" />
                        </q-card-section>
                      </q-card>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel class="q-pa-none" name="collage">
                    <div
                      class="card-collage q-ma-none row items-start q-gutter-sm"
                    >
                      <q-card @click="onClickTableTransfer" flat bordered>
                        <q-card-section>                          
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/TableTransfer.svg"
                          >
                          <q-tooltip>
                            Table Transfer
                          </q-tooltip>
                          </q-img>                          
                        </q-card-section>
                      </q-card>
                      <q-card @click="getRestInvOpenStandTable()" flat bordered>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/StandingMode.svg"
                          >
                          <q-tooltip>
                            Standing Mode
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card @click="onClickDialogSelectOrderTaker()" flat bordered>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/SelectOrderTakers.svg"
                          >
                          <q-tooltip>
                            Select Order Taker
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card @click="flagOrderTakerDisable ? null : onClickDialogChangeUser()" flat bordered>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/ChangeUser.svg"
                          >
                          <q-tooltip>
                            Change User
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card @click="onClickDiscount()" flat bordered>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/Discount.svg"
                          >
                          <q-tooltip>
                            Discount
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card @click="flagPrintOrderCheckerEnable ? onClickPrintOrderChecker : null">
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/PrintOrderChecker.svg"
                          >
                          <q-tooltip>
                            Print Order Checker
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/rePrintBill1.svg"
                          >
                          <q-tooltip>
                            Reprint Bill
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                      <q-card @click="onClickPrintBill = true" flat bordered>
                        <q-card-section>
                          <q-img
                            class="img-collage"
                            src="../../icons/OU/collage/BillPrint.svg"
                          >
                          <q-tooltip>
                            Bill Print
                          </q-tooltip>
                          </q-img>
                        </q-card-section>
                      </q-card>
                    </div>
                  </q-tab-panel>
                </q-tab-panels> -->
              </div>

              <!-- Bill Number -->
              <q-card class="bg-dark q-pa-md q-ml-lg q-mt-sm">
                <div class="row text-white"> 
                  <div class="col-6">
                    <p class="text-subtitle1 text-grey-7">Bill Number : <span class="q-ml-sm text-white text-weight-bold">{{dataTable['rechnr']}}</span></p>
                    <p class="text-subtitle1 text-grey-7">Pax : <span class="q-ml-sm text-white text-weight-bold">{{dataTable['belegung']}}</span></p>
                  </div>
                  <div class="col-6">
                    <!-- <p class="q-ml-sm">
                      <span class="text-weight-bolder">{{dataTable.bezeich}}</span> <br />
                      {{dataTable.bilname}}
                    </p> -->
                    <p class="text-subtitle1 text-grey-7"><span class="text-white text-weight-bold">{{dataTable['bezeich']}}</span></p>
                    <p class="text-subtitle1 text-grey-7"><span class="text-white text-weight-bold">{{dataTable['bilname']}}</span></p>
                  </div>
                </div>
                <q-separator />
                <q-tabs
                  v-model="tabbillnumber"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator >
                  <q-tab name="neworder" label="New Order" />
                  <q-tab name="ordered" label="Ordered" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tabbillnumber">
                  <q-tab-panel class="q-pa-none" name="neworder">
                    <div class="bg-grey-10 text-white">
                      <q-list dark class="scroll overflow" style="min-height: 350px; max-height: 350px">
                        <template v-for="datarow in dataNewOrder">
                          <q-item clickable v-ripple :key="datarow['position']" @click="onClickNewOrder(datarow)" >
                            <q-item-section avatar top>
                              <q-item-label class="q-mt-sm"
                                ><strong>{{datarow['qty']}}</strong></q-item-label>
                            </q-item-section>

                            <q-item-section top>
                              <q-item-label lines="1">
                                <span class="text-weight-medium">{{datarow['bezeich']}}</span>
                              </q-item-label>
                              <q-item-label caption lines="1">
                                {{datarow['remark']}}
                              </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                              <div class="text-grey-3 q-gutter-xs">
                                <q-btn size="12px" flat dense :label="datarow['epreis1']" />
                              </div>
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-list>
                      <div class="row q-gutter-md">
                        <div class="col">
                          <q-btn
                            :disable="dataNewOrder.length === 0"
                            color="primary"
                            class="full-width"
                            label="CONFIRM"
                            @click="showDialogConfirmMenu = true"
                          />
                        </div>
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel class="q-pa-none" name="ordered">
                    <div class="bg-grey-10 text-white">
                      <q-list dark class="scroll overflow" style="min-height: 200px; max-height: 200px">
                        <template v-for="datarow in dataOrdered">
                          <q-item clickable v-ripple :key="datarow['position']">
                           <q-item-section avatar top>
                            <q-item-label class="q-mt-sm"><strong>{{datarow['anzahl']}}</strong></q-item-label>
                          </q-item-section>

                          <q-item-section top>
                            <q-item-label lines="1">
                              <span class="text-weight-medium">{{datarow['bezeich']}}</span>
                            </q-item-label>
                            <q-item-label caption lines="1">
                              {{datarow['remark']}}
                            </q-item-label>
                          </q-item-section>

                          <q-item-section top side>
                            <div class="text-grey-3 q-gutter-xs">
                              <q-btn size="14px" flat dense :label="datarow['betrag']" />
                              <q-btn size="12px" flat dense round icon="mdi-dots-vertical" >
                                <q-menu>
                                  <q-list style="min-width: 100px;">
                                    <q-item clickable @click="onSplitItem(datarow)" v-close-popup>
                                      <q-item-section>
                                        Split Item
                                      </q-item-section>
                                    </q-item>

                                    <q-item clickable @click="onClickVoidItem(datarow)" v-close-popup>
                                      <q-item-section>Void Item</q-item-section>
                                    </q-item>
                                  </q-list>
                                </q-menu>
                              </q-btn>
                            </div>
                          </q-item-section>
                           
                          </q-item>
                        </template>

                        <!-- <q-item>
                          <q-item-section class="text-grey-7"
                            >Sub Total</q-item-section>
                          <q-item-section avatar>
                            <q-item-label class="text-grey-5">
                              Rp. 0
                            </q-item-label>
                          </q-item-section>
                        </q-item> -->

                        <!-- <q-item>
                          <q-item-section class="text-white"
                            >Total</q-item-section
                          >
                          <q-item-section avatar>
                            <q-item-label class="text-white">
                              {{dataTable['saldo']}}
                            </q-item-label>
                          </q-item-section>
                        </q-item> -->
                      </q-list> 

                      <div class="row q-gutter-sm">
                        <div class="col">
                          <q-list>
                            <q-item>
                              <q-item-section class="text-white"
                                >Sub Total</q-item-section
                              >
                              <q-item-section avatar>
                                <q-item-label class="text-white">
                                  {{dataTable['saldo']}}
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section class="text-white"
                                >Service</q-item-section
                              >
                              <q-item-section avatar>
                                <q-item-label class="text-white">
                                  {{dataTable['saldo']}}
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section class="text-white"
                                >Tax</q-item-section
                              >
                              <q-item-section avatar>
                                <q-item-label class="text-white">
                                  {{dataTable['saldo']}}
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section class="text-white text-weight-bold"
                                >Total</q-item-section
                              >
                              <q-item-section avatar>
                                <q-item-label class="text-white">
                                  {{dataTable['saldo']}}
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>
                      </div>

                      <div class="row q-gutter-sm">                        
                        <div class="col">                          
                          <q-btn
                            outline
                            color="primary"
                            class="full-width"
                            label="SPLIT BILL"
                            @click="onClickSplitBill()"
                          />
                        </div>
                        <div class="col">
                          <q-btn
                            color="primary"
                            class="full-width"
                            label="PAY BILL"
                            @click="onClickPayment()"
                          />
                        </div>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </div>
          </div>
        </div>

        <dialogSelectOrderTakers 
          :dialogSelectOrderTaker="dialogSelectOrderTaker" 
          :dataSelectedOrderTaker="dataSelectedOrderTaker" 
          @onDialogMenuOrderTaker="onDialogMenuOrderTaker"/>

        <dialogNewOrder
          :dialogEditNewOrder="dialogEditNewOrder"
          :dataSelected="dataSelectedNewOrder"
          @onDialogEditNewOrder="onDialogEditNewOrder"
          @onDialogCancelEditNewOrder="onDialogCancelEditNewOrder"
          @onRemoveNewOrder="onRemoveNewOrder"/>

        <dialogSplitItem
          :dialogSplitItem="dialogSplitItem"
          :dataSelectedSplitItem="dataSelected"
          @onDialogSplitItem="onDialogSplitItem"/>

        <dialogPayment
          :dialogPayment="dialogPayment"
          :dataTable="dataTable"
          :dataPrepare="dataPrepare"
          @onDialogPayment="onDialogPayment" />

        <dialogSplitBill
          :showDialogSplitBill="showDialogSplitBill"
          :dataSelectedSplitBill="dataSelected"
          :dataTable="dataTable"
          :dataPrepare="dataPrepare"
          @onDialogSplitBill="onDialogSplitBill"/>

        <dialogDiscountBill 
          :showDialogDiscountBill="showDialogDiscountBill"
          :dataTable="dataTable"
          @onDialogDiscountBill="onDialogDiscountBill" />

        <!-- Confirm Table Transfer -->
        <q-dialog v-model="showConfirmationDialog" persistent>
          <q-card style="max-width: 1500px;width:450px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Confirm</q-toolbar-title>
            </q-toolbar>

            <q-card-section class="row items-center">
              <div class="row">
                <div class="col-md-2">
                  <q-avatar icon="mdi-help" color="negative" text-color="white" />
                </div>
                <div class="col-md-10">                  
                  <p class="q-ml-md">Make sure you no others transactin with Bill: <br>
                  Do you want to continue?</p>
                </div>
              </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline label="Cancel" color="primary" v-close-popup />
              <q-btn unelevated label="Ok" color="primary" @click="onClickConfirmation()" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Dialog Standing Mode -->
        <q-dialog v-model="showDialogStandingTableNotDefined" persistent>
          <q-card style="max-width: 1500px;width:300px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Information</q-toolbar-title>
            </q-toolbar>

            <q-card-section class="row items-center">
              <div class="row">
                <div class="col-md-2">
                  <q-avatar icon="mdi-information" color="info" text-color="white" />
                </div>
                <div class="col-md-10">                  
                  <p class="q-pl-lg q-my-sm">{{titleDialogStandingTable}}</p>
                </div>
              </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn unelevated label="Ok" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        
        <!-- Dialog Print Bill -->
        <q-dialog v-model="onClickPrintBill" persistent>
          <q-card style="max-width: 1500px;width:350px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Question</q-toolbar-title>
            </q-toolbar>

            <q-card-section>
              <div class="row">
                <div class="col-md-2">
                  <q-avatar icon="mdi-help" color="info" text-color="white" />
                </div>
                <div class="col-md-10">                  
                  <p class="q-ml-md q-mt-sm">Print the bill?</p>
                </div>
              </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline label="Cancel" color="primary" v-close-popup />
              <q-btn unelevated label="Ok" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <dialogTransferTable 
          :showDialogTransferTable="showDialogTransferTable"
          :dataTable="dataTable"
          @onDialogTransferTable="onDialogTransferTable" />

        <dialogChangeUser 
          :showDialogChangeUser="showDialogChangeUser"
          @onDialogChangeUser="onDialogChangeUser" />

        <dialogTablePlan
          :showDialogTablePlan="showDialogTablePlan"
          :dataPrepare="dataPrepare"
          @onDialogTablePlan="onDialogTablePlan"
          @onResultTablePlan="onResultTablePlan"/>

        <dialogInputPrice
          :showDialogInputPrice="showDialogInputPrice"
          @onDialogInputPrice="onDialogInputPrice"/>

        <dialogInputMultiple          
          :showDialogInputMultiple="showDialogInputMultiple"
          @onDialogInputMultiple="onDialogInputMultiple"/>

        <dialogSelectMenuItem 
          :showDialogSelectMenuItem="showDialogSelectMenuItem"
          @onDialogSelectMenuItem="onDialogSelectMenuItem"/>
        
        <dialogInputDescription
          :showDialogInputDescription="showDialogInputDescription"
          @onDialogInputDescription="onDialogInputDescription"/>

        <dialogInputPassword
          :showDialogInputPassword="showDialogInputPassword"
          :pass="pass"
          @onDialogInputPassword="onDialogInputPassword"/>

        <dialogCashierTransfer
          :showDialogCashierTransfer="showDialogCashierTransfer"
          :dataSelectedCashierTransfer="dataSelected"
          :dataTable="dataTable"
          :dataPrepare="dataPrepare"
          @onDialogCashierTransfer="onDialogCashierTransfer"/>
        
        <dialogCloseBill
          :showDialogCloseBill="showDialogCloseBill"
          :dataTable="dataTable"
          :dataPrepare="dataPrepare"
          @onDialogCloseBill="onDialogCloseBill" />

        <dialogChangeOutlet
          :showDialogChangeOutlet="showDialogChangeOutlet"
          :dataSelectedChangeOutlet="dataSelected"
          :dataTable="dataTable"
          :dataPrepare="dataPrepare"
          flagActivity="changeoutlet"
          @onDialogChangeOutlet="onDialogChangeOutlet" />

        <vue-touch-keyboard 
            id="keyboardbottom"
            :options="options" 
            v-if="keyboardVisible" 
            layout="compact" 
            :accept="hideKeyboard" 
            :next="hideKeyboard"
            :input="inputbottom"
            :close="hideKeyboard" />

        <dialogVoidItem
          :showDialogVoidItem="showDialogVoidItem"
          :dataSelectedVoidItem="dataSelected"
          :dataTable="dataTable"
          :dataPrepare="dataPrepare"
          @onDialogVoidItem="onDialogVoidItem"/>

        <q-dialog v-model="showDialogKpr" persistent>
          <q-card style="max-width: 1500px;width:450px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Confirmation</q-toolbar-title>
            </q-toolbar>

          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-md-2">
                <q-avatar icon="mdi-help" color="negative" text-color="white" />
              </div>
              <div class="col-md-10">                  
                <p class="q-ml-md">{{titleDialogKpr}}</p>
              </div>
            </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline color="primary" label="Cancel" @click="onClickDialogKpr(false)" />
              <q-btn unelevated label="Ok" color="primary" @click="onClickDialogKpr(true)" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="showDialogMergeBill" persistent>
          <q-card style="max-width: 1500px;width:450px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Confirmation</q-toolbar-title>
            </q-toolbar>

          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-md-2">
                <q-avatar icon="mdi-help" color="negative" text-color="white" />
              </div>
              <div class="col-md-10">                  
                <p class="q-ml-md">Table already has an active bill. Select OK to open and merge the bill, or select CANCEL to open new table</p>
              </div>
            </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline color="primary" label="Cancel" @click="onClickMergeBill(false)" />
              <q-btn unelevated label="Ok" color="primary" @click="onClickMergeBill(true)" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="showDialogConfirmMenu" persistent>
          <q-card style="max-width: 1500px;width:450px;">
            <q-toolbar>
              <q-toolbar-title class="text-white text-weight-medium">Confirmation</q-toolbar-title>
            </q-toolbar>

          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-md-2">
                <q-avatar icon="mdi-help" color="negative" text-color="white" />
              </div>
              <div class="col-md-10">                  
                <p class="q-ml-md">Confirm your menu(s) selection?</p>
              </div>
            </div>              
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline color="primary" label="Cancel" v-close-popup />
              <q-btn unelevated label="Ok" color="primary" @click="onClickConfirmNewOrder" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        

          <!-- <div>
            <q-circular-progress
              indeterminate
              size="100px"
              color="cyan"
              class="progressDialog" />
          </div> -->
    </div>
</template>

<script lang="ts">
import VueTouchKeyboard from 'vue-touch-keyboard';
// import style from 'vue-touch-keyboard/dist/vue-touch-keyboard.css';

Vue.use(VueTouchKeyboard);
// Vue.use(style);
Vue.component('vue-touch-keyboard', VueTouchKeyboard.components);

import { defineComponent, reactive, toRefs, onMounted, } from '@vue/composition-api';
import { date, Notify } from 'quasar';
import Vue from 'vue';
import { store } from '~/store';
import { useExtraMenu } from '~/app/shared/compositions/use-extra-menu';

interface State {
  isLoading: boolean;
  dialog: boolean;
  title: string;
  input: null;
  inputbottom: null
  dialogSelectOrderTaker: boolean,
  dataSelectedOrderTaker: null,
  dataSubGroup: [],
  dataArticle: [],
  dataFilteredSubGroup: any,
  dataFilteredArticle: any,
  dataNewOrder: any,
  dataOrdered:any,
  dataSelectedNewOrder: null
  dialogEditNewOrder: boolean,
  dataTable: {},
  dialogSplitItem: boolean,
  dataSelected: {},
  dialogPayment: boolean,
  showDialogSplitBill: boolean,
  showDialogDiscountBill: boolean,
  showDialogTransferTable: boolean,
  showConfirmationDialog: boolean,
  showDialogStandingTableNotDefined: boolean,
  titleDialogStandingTable: string
  showDialogChangeUser: boolean,
  onClickPrintBill: boolean,
  currDept: any,
  showDialogTablePlan: boolean;
  dataPrepare: {},
  options: {},
  qty: any,
  keyboardVisible: boolean,
  text: string,
  showDialogInputPrice: boolean,
  dataValidationSelectArticle: {},
  tempDataRowSelectedArticle: {},
  showDialogInputMultiple: boolean,
  showDialogSelectMenuItem: boolean,
  showDialogInputDescription: boolean,
  showDialogInputPassword: boolean, 
  pass: string;
  flagOrderTakerDisable: boolean;
  flagFirstLoad: any;
  showDialogCashierTransfer: boolean,
  showDialogChangeOutlet: boolean,
  showDialogCloseBill: boolean,
  currentState: string,
  showDialogVoidItem: boolean,
  restaurant: string,
  dataPrepareInv: {},
  objRequestInvUpdateBill: {},
  askKpr : boolean,
  showDialogKpr: boolean,
  titleDialogKpr: string,
  paytype: any,
  tempFlCodePayment: any,
  flagPostingMenu: boolean,
  flagRefreshAfterAction: boolean,
  showDialogMergeBill: boolean, 
  showDialogConfirmMenu: boolean,
  tabbillnumber: string,
  billDate: '',
  flagPrintOrderCheckerEnable: boolean,
  tempDataPayment: {},
  isCancel: boolean,
}

export default defineComponent({
  setup(_, {root: { $api } }) {
    const dataStoreLogin = store.state.auth.user || {} as any;

    const state = reactive<State>({
      isLoading: false,
      dialog: false,
      title: 'Menu',
      input: null,
      inputbottom: null,
      dialogSelectOrderTaker: false,
      dataSelectedOrderTaker: null,
      dataSubGroup: [],
      dataArticle: [],
      dataFilteredSubGroup: [] as any,
      dataFilteredArticle: [] as any,
      dataNewOrder: [] as any,
      dataOrdered: [] as any,
      dataSelectedNewOrder: null,
      dialogEditNewOrder: false,
      dataTable: {},
      dialogSplitItem: false,
      dataSelected: {},
      dialogPayment: false,
      showDialogSplitBill: false,
      showDialogDiscountBill: false,
      showDialogTransferTable: false,
      showConfirmationDialog: false,
      showDialogStandingTableNotDefined: false,
      titleDialogStandingTable: '',
      showDialogChangeUser: false,
      onClickPrintBill: false,
      currDept: 1,
      showDialogTablePlan: false,
      dataPrepare: {},
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      qty: 1,
      keyboardVisible: false,
      text: '',
      showDialogInputPrice: false,
      dataValidationSelectArticle: {},
      tempDataRowSelectedArticle: {},
      showDialogInputMultiple: false,
      showDialogSelectMenuItem: false,
      showDialogInputDescription: false,
      showDialogInputPassword: false,
      pass: "",
      flagOrderTakerDisable: false,
      flagFirstLoad: 0,
      showDialogCashierTransfer: false,
      showDialogChangeOutlet: false,
      showDialogCloseBill: false,
      currentState: "",
      showDialogVoidItem: false,
      restaurant: '',
      dataPrepareInv: {},
      objRequestInvUpdateBill: {},
      askKpr : false,
      showDialogKpr: false,
      titleDialogKpr: '',
      paytype: 0,
      tempFlCodePayment: -1,
      flagPostingMenu: false,
      flagRefreshAfterAction: false,
      showDialogMergeBill: false,
      showDialogConfirmMenu: false,
      tabbillnumber: 'neworder',
      billDate: '',
      flagPrintOrderCheckerEnable: false,
      tempDataPayment: {},
      isCancel : false,
    });

    onMounted(async () => { 
      state.isLoading = true;

      // state.flagFirstLoad = Cookies.get('OU_isFisrtLoad');
      // if (state.flagFirstLoad == undefined) {
      //   state.flagFirstLoad = Cookies.set('OU_isFisrtLoad', "0") as any;
      // }
      // console.log('flagFirstLoad', state.flagFirstLoad);

      setTimeout(() => {
        getHTParam(4, 60);
      }, 1000);
    });

    // onDestroy : 
    // window.onbeforeunload = function(){
    //   Cookies.remove('OU_isFisrtLoad');
    //   state.flagFirstLoad = Cookies.get('OU_isFisrtLoad');
    //   console.log("refresh, delete ou cookies");
    // }



    // OnClick listener Event    
    const onClickSubGroup = (datarow) => {
      for (let i = 0; i<state.dataFilteredSubGroup.length; i++) {
        const zknr = datarow['zknr'];
        const dataRow = state.dataFilteredSubGroup[i];

        state.dataFilteredSubGroup[i]['selected'] = (zknr == dataRow['zknr']) ? true : false;
      }

      state.dataFilteredArticle = [];
      for (let i = 0; i<state.dataArticle.length; i++) {
        const dataRow = state.dataArticle[i];
        const zknr = datarow['zknr'];

        if (dataRow['zwkum'] === zknr) {
          state.dataFilteredArticle.push(dataRow);
        }
      }
    } 

    const onClickArticle = (datarows) => {
      if (state.tabbillnumber != "neworder") {
        state.tabbillnumber = 'neworder';
      }

      if (state.qty == 0) {
        Notify.create({
          type: "warning",
          message: 'Quantity cannot be 0',
        });
      } else {
        if (state.dataTable['tischnr'] == undefined) {
          Notify.create({
            color: "red",
            message: 'Select table first',
          });
          onDialogTablePlan(true);
        } else {
          getHBLineSelectItem(datarows);
        }
      }
    }

    const onClickNewOrder = (datarow) => {
      state.dataSelectedNewOrder = datarow;
      // console.log('datarow : ', datarow);
      onDialogEditNewOrder(true, null);
    }

    const onSplitItem = (datarow) => {
      state.dataSelected = datarow;
      onDialogSplitItem(true, datarow);
    }

    const onClickPayment = () => {
      if (state.dataTable.hasOwnProperty('dataThBill')) {
        if (state.dataTable['dataThBill'].length == 0) {
          Notify.create({
            message: 'No bill found',
              type: 'warning',
            });
            return false;
        } else if (state.dataTable['tischnr'] == 0) {
          Notify.create({
            message: 'No table selected, select table first',
              type: 'warning',
            });
            onDialogTablePlan(true);
            return false;
        } else {
          onDialogPayment(true, '', {}, 0);
        }
      } else {
        Notify.create({
          message: 'No bill found and no table selected',
          type: 'warning',
        });
        return false;
      }
    }

    const onClickSplitBill = () => {
      state.currentState = 'splitbill';
      getRestInvCheckSaldo(state.currentState);
    }

    const onClickConfirmNewOrder = () => {
      state.flagPostingMenu = true;
      state.showDialogConfirmMenu = false;
      state.titleDialogKpr = 'Send ordered menu item(s) to kitchen printer?';

      getRestInvRunHelp4();
    }

    const onClickDiscount = () => {
      zuggriff(79,2,"checkOpenDiscount");
    }
   
    const onClickTableTransfer = () => {
      state.currentState = "tabletransfer";
      getRestInvCheckSaldo(state.currentState);
    }

    const onClickDialogSelectOrderTaker = () => {
      onDialogSelectOrderTaker(true);
      
    }

    const onClickDialogChangeUser = () => {
      onDialogChangeUser(true);      
    }

    const onClickConfirmation = () => {
      if (state.currentState == "tabletransfer") {
        onDialogTransferTable(true);
      }
    }

    const onClickDialogKpr = (isOKButton) => {
      state.showDialogKpr = false;

      if (isOKButton) {
        if (state.flagPostingMenu) {
          getAddKitchpr();
        } else {
          getPrintBill();
        }
      } else {
        if (state.flagPostingMenu) {
          checkBill(); 
        } else {
          if (state.paytype == 2) {
            onDialogTablePlan(true);          
          } else if (state.paytype == 1) {
            getBillLine();
          } else if (state.paytype == 11) {
            onDialogTablePlan(true);          
          } else if (state.paytype == 3) {
            if (state.tempFlCodePayment == 1) {
              onDialogTablePlan(true);
            } else if (state.tempFlCodePayment == 0) {
             getBillLine();
            }
          } else if (state.paytype == 7) {
            onDialogTablePlan(true);
          } else if (state.paytype == 8) {
            onDialogTablePlan(true);          
          }
        }
      }
    }

    const onClickMergeBill = (isButtonOK) => {
      state.showDialogMergeBill = false;

      if (isButtonOK) {
        getRestInvOpenTable();
      } else {
        onDialogTablePlan(true);
      }
    }

    const onClickPrintOrderChecker = () => {

    }

    // Dialog Listener
    const onDialogSelectOrderTaker = (val) => {
      if(!val) {
        state.dataSelectedOrderTaker = null;
      }
      state.dialogSelectOrderTaker = val;
    }

    const onDialogMenuOrderTaker = (val, val2) => {
      state.dialogSelectOrderTaker = val;
      state.dataSelectedOrderTaker = val2;
      state.dataPrepare['dataSelectedOrderTaker'] = state.dataSelectedOrderTaker;
      
      if (!val) {
        // zuggriff(19, 2);
        // checkBill();
      }
    }

    const onDialogCancelEditNewOrder = () => {
      state.dialogEditNewOrder = false;
    }

    const onDialogEditNewOrder = (val, datarow) => {
      state.dialogEditNewOrder = val;

      if (!val) {
        for (let i = 0; i<state.dataNewOrder.length; i++) {
          const position = datarow['position'];

          if (i === position) {
            state.dataNewOrder[i] = datarow;
            break;
          }
        }

        for(let i = 0; i<state.dataNewOrder.length; i++) {
          state.dataNewOrder[i]['position'] = i;
        } 
      }
    }

    const onDialogSplitItem = (val, datarow) => {
      if (!val) {
        state.dataSelected = {};
      }
      state.dialogSplitItem = val;
    }

    const onRemoveNewOrder = (val, datarow) => {
      state.dialogEditNewOrder = val;

      if(!val) {
        for (let i = 0; i<state.dataNewOrder.length; i++) {
          const position = datarow['position'];

          if (i === position) {
            state.dataNewOrder.splice(i, 1);            
            break;
          }
        }

        for(let i = 0; i<state.dataNewOrder.length; i++) {
          state.dataNewOrder[i]['position'] = i;
        } 
        // console.log(state.dataNewOrder);
      }

    }

    const onDialogPayment = (val, flag, data, payType) => {
      state.dialogPayment = val;
      state.dataTable['dataPrepareInv'] = state.dataPrepare;
      state.paytype = payType;
      state.askKpr = true;
      state.flagPostingMenu = false;
      state.titleDialogKpr = 'Print the bill?';

      if (!val && flag == 'ok') {
        state.dataTable['dataPayment'] = data;
        // state.flagFirstLoad = 1;

        if (payType == 1) {
          console.log('should refresh , Cash : ', state.dataTable)
          const flagPay = data['flagPay'];  
          if (flagPay == 'full') {
            state.dataTable['saldo'] = 0;
            state.dataOrdered = [];
            state.dataNewOrder = [];
            state.dataTable['belegung'] = 0;
            state.dataTable['bezeich'] = '';
            state.dataTable['bilname'] = '';
            state.qty = 1;
            state.objRequestInvUpdateBill = {};

            if (state.askKpr) {
              state.paytype = 11;
              state.showDialogKpr = true;
            } else {
              onDialogTablePlan(true);
            }
          } else if (flagPay == 'half') {
            state.objRequestInvUpdateBill = {
              pvILanguage : 1,
              recId: state.dataTable['dataThBill'][0]['rec-id'],
              recIdHArtikel :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['rec-id'],
              deptname :state.dataPrepare['deptname'],
              transdate: date.formatDate((new Date), 'MM/DD/YY'),
              hArtart :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['artart'],
              cancelOrder :'false',
              hArtikelServiceCode :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['service-code'],
              amount: state.dataTable['dataPayment']['payment'],
              amountForeign:state.dataTable['dataPayment']['payment'],
              price: 0,
              doubleCurrency: state.dataPrepare['doubleCurrency'],
              qty: 1,
              exchgRate:state.dataPrepare['exchgRate'],
              priceDecimal:state.dataPrepare['priceDecimal'],
              orderTaker:state.dataPrepare['dataSelectedOrderTaker'] == null ? '1' : state.dataPrepare['dataSelectedOrderTaker'],
              tischnr:state.dataTable['tischnr'],
              currDept:state.dataPrepare['currDept'],
              currWaiter:state.dataPrepare['currWaiter'],
              gname:state.dataTable['bilname'],
              pax:state.dataTable['belegung'],
              kreditlimit: state.dataTable['klimit'],
              addZeit: 1,
              billart: state.dataTable['dataPayment']['billart'],
              description:  state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['bezeich'],
              changeStr:' ',
              ccComment:' ',
              cancelStr:' ',
              reqStr:' ',
              voucherStr:state.dataTable['dataPayment']['voucherStr'],
              hogaCard:' ',
              printToKitchen:'true',
              fromAcct:'false',
              hArtnrfront: state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['artnrfront'],
              payType:0,
              guestnr:0,
              transferZinr:' ',
              curedeptFlag:'false',
              foreignRate:'false',
              currRoom:' ',
              userInit:dataStoreLogin['userInit'],
              hogaResnr:0,
              hogaReslinnr:0,
              inclVat:'false',
              getPrice:'0',
              mcStr:'0',
              'submenuList': {'submenu-list' : [{
                "menurecid": 0,
                "zeit": 0,
                "nr": 0,
                "artnr": 0,
                "bezeich": " ",
                "anzahl": 0,
                "zknr": 0,
                "request": " "
              }]},
            }
            // console.log('request : ', state.objRequestInvUpdateBill);
            restInvUpdateBill1('cash');
          }
        } else if (payType == 2) {
          // console.log('should refresh , Card / dataTable : ', state.dataTable);
          
          state.objRequestInvUpdateBill = {
            pvILanguage : 1,
            recId: state.dataTable['dataThBill'][0]['rec-id'],
            recIdHArtikel :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['rec-id'],
            deptname :state.dataPrepare['deptname'],
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
            hArtart :state.dataTable['dataPayment']['dataSelected']['artart'],
            cancelOrder :'false',
            hArtikelServiceCode :state.dataTable['dataPayment']['dataSelected']['service-code'],
            amount: -state.dataTable['dataThBill'][0]['saldo'],
            amountForeign:-state.dataTable['dataThBill'][0]['saldo'],
            price: 0,
            doubleCurrency: state.dataPrepare['doubleCurrency'],
            qty: 1,
            exchgRate:state.dataPrepare['exchgRate'],
            priceDecimal:state.dataPrepare['priceDecimal'],
            orderTaker:state.dataPrepare['dataSelectedOrderTaker'] == null ? '1' : state.dataPrepare['dataSelectedOrderTaker'],
            tischnr:state.dataTable['tischnr'],
            currDept:state.dataPrepare['currDept'],
            currWaiter:state.dataPrepare['currWaiter'],
            gname:state.dataTable['bilname'],
            pax:state.dataTable['belegung'],
            kreditlimit: state.dataTable['klimit'],
            addZeit: 1,
            billart: state.dataTable['dataPayment']['billart'],
            description:  state.dataTable['dataPayment']['dataSelected']['bezeich'],
            changeStr:' ',
            ccComment:' ',
            cancelStr:' ',
            reqStr:' ',
            voucherStr:' ',
            hogaCard:' ',
            printToKitchen:'true',
            fromAcct:'false',
            hArtnrfront: state.dataTable['dataPayment']['dataSelected']['artnrfront'],
            payType:0,
            guestnr:0,
            transferZinr:' ',
            curedeptFlag:'false',
            foreignRate:'false',
            currRoom:' ',
            userInit:dataStoreLogin['userInit'],
            hogaResnr:0,
            hogaReslinnr:0,
            inclVat:'false',
            getPrice:'0',
            mcStr:'0',
            'submenuList': {'submenu-list' : [{
              "menurecid": 0,
              "zeit": 0,
              "nr": 0,
              "artnr": 0,
              "bezeich": " ",
              "anzahl": 0,
              "zknr": 0,
              "request": " "
            }]},
          }
          // console.log('request : ', state.objRequestInvUpdateBill);
          restInvUpdateBill1('card');
        } else if (payType == 3) {
          // console.log('should refresh , City Legder : ', state.dataTable)
          state.objRequestInvUpdateBill = {
            pvILanguage : 1,
            recId: state.dataTable['dataThBill'][0]['rec-id'],
            recIdHArtikel :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['rec-id'],
            deptname :state.dataPrepare['deptname'],
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
            hArtart :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['artart'],
            cancelOrder :'false',
            hArtikelServiceCode :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['service-code'],
            amount: state.dataTable['dataPayment']['payment'],
            amountForeign:state.dataTable['dataPayment']['payment'],
            price: 0,
            doubleCurrency: state.dataPrepare['doubleCurrency'],
            qty: 1,
            exchgRate:state.dataPrepare['exchgRate'],
            priceDecimal:state.dataPrepare['priceDecimal'],
            orderTaker:state.dataPrepare['dataSelectedOrderTaker'] == null ? '1' : state.dataPrepare['dataSelectedOrderTaker'],
            tischnr:state.dataTable['tischnr'],
            currDept:state.dataPrepare['currDept'],
            currWaiter:state.dataPrepare['currWaiter'],
            gname:state.dataTable['bilname'],
            pax:state.dataTable['belegung'],
            kreditlimit: state.dataTable['klimit'],
            addZeit: 1,
            billart: state.dataTable['dataPayment']['billart'],
            description:  state.dataTable['dataPayment']['dataSelected']['bezeich'],
            changeStr:' ',
            ccComment:' ',
            cancelStr:' ',
            reqStr:' ',
            voucherStr:' ',
            hogaCard:' ',
            printToKitchen:'true',
            fromAcct:'false',
            hArtnrfront: state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['artnrfront'],
            payType:0,
            guestnr:0,
            transferZinr:' ',
            curedeptFlag:'false',
            foreignRate:'false',
            currRoom:' ',
            userInit:dataStoreLogin['userInit'],
            hogaResnr:0,
            hogaReslinnr:0,
            inclVat:'false',
            getPrice:'0',
            mcStr:'0',
            'submenuList': {'submenu-list' : [{
              "menurecid": 0,
              "zeit": 0,
              "nr": 0,
              "artnr": 0,
              "bezeich": " ",
              "anzahl": 0,
              "zknr": 0,
              "request": " "
            }]},
          }
          // console.log('request : ', state.objRequestInvUpdateBill);

          restInvUpdateBill1('cityledger');
        } else if (payType == 4) {
          // console.log('should refresh , Transfer to Guest Folio : ', state.dataTable)
          const flag = state.dataTable['dataPayment']['tHBill']['t-h-bill'][0]['flag'];
          if (flag == 1) {
            state.dataTable['saldo'] = 0;
            state.dataOrdered = [];
            state.dataNewOrder = [];
            state.dataTable['belegung'] = 0;
            state.dataTable['bezeich'] = '';
            state.dataTable['bilname'] = '';
            state.qty = 1;
            state.objRequestInvUpdateBill = {};
            onDialogTablePlan(true);
          }
        } else if (payType == 5) {
          console.log('should refresh , Transfer to Non Guest Folio : ', state.dataTable)
        } else if (payType == 6) {
          console.log('should refresh , Transfer to Master Folio : ', state.dataTable)
        } else if (payType == 7) {
          // console.log('should refresh , Compliment : ', state.dataTable)

          state.objRequestInvUpdateBill = {
            pvILanguage : 1,
            recId: state.dataTable['dataThBill'][0]['rec-id'],
            recIdHArtikel :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['rec-id'],
            deptname :state.dataPrepare['deptname'],
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
            hArtart :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['artart'],
            cancelOrder :'false',
            hArtikelServiceCode :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['service-code'],
            amount: state.dataTable['dataPayment']['amount'],
            amountForeign:state.dataTable['dataPayment']['amountForeign'],
            price: 0,
            doubleCurrency: state.dataPrepare['doubleCurrency'],
            qty: 1,
            exchgRate:state.dataPrepare['exchgRate'],
            priceDecimal:state.dataPrepare['priceDecimal'],
            orderTaker:state.dataPrepare['dataSelectedOrderTaker'] == null ? '1' : state.dataPrepare['dataSelectedOrderTaker'],
            tischnr:state.dataTable['tischnr'],
            currDept:state.dataPrepare['currDept'],
            currWaiter:state.dataPrepare['currWaiter'],
            gname:state.dataTable['bilname'],
            pax:state.dataTable['belegung'],
            kreditlimit: state.dataTable['klimit'],
            addZeit: 1,
            billart: state.dataTable['dataPayment']['billart'],
            description:  state.dataTable['dataPayment']['dataSelected']['bezeich'],
            changeStr:' ',
            ccComment:' ',
            cancelStr:' ',
            reqStr:' ',
            voucherStr:' ',
            hogaCard:' ',
            printToKitchen:'true',
            fromAcct:'false',
            hArtnrfront: state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['artnrfront'],
            payType:0,
            guestnr:0,
            transferZinr:' ',
            curedeptFlag:'false',
            foreignRate:'false',
            currRoom:' ',
            userInit:dataStoreLogin['userInit'],
            hogaResnr:0,
            hogaReslinnr:0,
            inclVat:'false',
            getPrice:'0',
            mcStr:'0',
            'submenuList': {'submenu-list' : [{
              "menurecid": 0,
              "zeit": 0,
              "nr": 0,
              "artnr": 0,
              "bezeich": " ",
              "anzahl": 0,
              "zknr": 0,
              "request": " "
            }]},
          }
          // console.log('request : ', state.objRequestInvUpdateBill);

          restInvUpdateBill1('compliment');
        } else if (payType == 8) {
          // console.log('should refresh , Meal Coupon : ', state.dataTable)

          state.objRequestInvUpdateBill = {
            pvILanguage : 1,
            recId: state.dataTable['dataThBill'][0]['rec-id'],
            recIdHArtikel :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['rec-id'],
            deptname :state.dataPrepare['deptname'],
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
            hArtart :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['artart'],
            cancelOrder :'false',
            hArtikelServiceCode :state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['service-code'],
            amount: state.dataTable['dataPayment']['amount'],
            amountForeign:state.dataTable['dataPayment']['amountForeign'],
            price: 0,
            doubleCurrency: state.dataPrepare['doubleCurrency'],
            qty: 1,
            exchgRate:state.dataPrepare['exchgRate'],
            priceDecimal:state.dataPrepare['priceDecimal'],
            orderTaker:state.dataPrepare['dataSelectedOrderTaker'] == null ? '1' : state.dataPrepare['dataSelectedOrderTaker'],
            tischnr:state.dataTable['tischnr'],
            currDept:state.dataPrepare['currDept'],
            currWaiter:state.dataPrepare['currWaiter'],
            gname:state.dataTable['bilname'],
            pax:state.dataTable['belegung'],
            kreditlimit: state.dataTable['klimit'],
            addZeit: 1,
            billart: state.dataTable['dataPayment']['billart'],
            description:  state.dataTable['dataPayment']['dataSelected']['bezeich'],
            changeStr:' ',
            ccComment:' ',
            cancelStr:' ',
            reqStr:' ',
            voucherStr:' ',
            hogaCard:' ',
            printToKitchen:'true',
            fromAcct:'false',
            hArtnrfront: state.dataTable['dataPayment']['tHArtikel']['t-h-artikel'][0]['artnrfront'],
            payType:0,
            guestnr:0,
            transferZinr:' ',
            curedeptFlag:'false',
            foreignRate:'false',
            currRoom:' ',
            userInit:dataStoreLogin['userInit'],
            hogaResnr:0,
            hogaReslinnr:0,
            inclVat:'false',
            getPrice:'0',
            mcStr:'0',
            'submenuList': {'submenu-list' : [{
              "menurecid": 0,
              "zeit": 0,
              "nr": 0,
              "artnr": 0,
              "bezeich": " ",
              "anzahl": 0,
              "zknr": 0,
              "request": " "
            }]},
          }
          // console.log('request : ', state.objRequestInvUpdateBill);

          restInvUpdateBill1('mealcoupon');
        } else if (payType == 9) {
          console.log('should refresh , Close Bill : ', state.dataTable)
          console.log('state : ', state);

          getRestInvPayCash2();
        }
        // checkBill();
      } 
    }

    const onDialogSplitBill = (val, flag) => {
      state.showDialogSplitBill = val;
      state.dataTable['dataPrepareInv'] = state.dataPrepare;

      if (!val && flag == 'ok') {
        state.dataTable['saldo'] = 0;
        state.dataOrdered = [];
        state.dataNewOrder = [];
        state.dataTable['belegung'] = 0;
        state.dataTable['bezeich'] = '';
        state.dataTable['bilname'] = '';
        state.qty = 1;
        state.objRequestInvUpdateBill = {};
        onDialogTablePlan(true);
      }

    }

    const onDialogDiscountBill = (val) => {
      state.showDialogDiscountBill=val;
    }

    const onDialogTransferTable = (val) => {
      state.showDialogTransferTable=val;
    }

    const onDialogChangeUser = (val) => {
      state.showDialogChangeUser=val;
    }

    const onDialogTablePlan = (val) => {
      state.showDialogTablePlan = val;
    }

    const onDialogInputPrice = (val, result) => {
      state.showDialogInputPrice = val;

      if (!state.showDialogInputPrice && result != null) {
        if (state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['bezaendern']) {
          state.dataValidationSelectArticle['tempPrice'] = result;
          onDialogInputDescription(true, null);
        } else {
          state.tempDataRowSelectedArticle['epreis1'] = result;
          initDataClickMenu();
        }
      }
    }

    const onDialogInputMultiple = (val, result) => {
      state.showDialogInputMultiple = val;

      if (!state.showDialogInputMultiple && result != null) {
        // state.tempDataRowSelectedArticle['epreis1'] = result;

        // console.log('result', state.tempDataRowSelectedArticle);
        const epreis1 = state.tempDataRowSelectedArticle['epreis1'];
        let epreis = (epreis1 * result);
        state.tempDataRowSelectedArticle['epreis1'] = epreis;
        state.tempDataRowSelectedArticle['bezeich'] = result + " " + state.tempDataRowSelectedArticle['bezeich'];
        
        if (state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['epreis1'] == 0
              && state.dataValidationSelectArticle['responseSelectItem2']['param172'] != "") {
          onDialogInputPassword(true, "");
        } else {
          initDataClickMenu();
        }
      }
    }

    const onDialogSelectMenuItem = (val, result) => {
      state.showDialogSelectMenuItem = val;

      if (!state.showDialogSelectMenuItem && result != null) {
        initDataClickMenu();
      }
    }

    const onDialogInputDescription = (e, result) => {
      state.showDialogInputDescription = e;

      if (!state.showDialogInputDescription && result != null) {
        if (state.dataValidationSelectArticle['tempPrice'] != null) {
            state.tempDataRowSelectedArticle['epreis1'] = state.dataValidationSelectArticle['tempPrice'];
        }
        state.tempDataRowSelectedArticle['bezeich'] = result;

        if (state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['epreis1'] == 0 
            && state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['param172'] != "") {
          onDialogInputPassword(true, "");
        } else {
          initDataClickMenu();
        }
      }
    }

    const onDialogInputPassword = (val, result) => {
      state.showDialogInputPassword = val;

      if (!state.showDialogInputPassword && result != null) {
        if (result == "123") {
          initDataClickMenu();
        }
      }
    }
    


    // HTTP Request and Response
    const zuggriff = (arrayNr, expectedNr, flagCheck) => {
      let zuggrifval = "false";
      async function asyncCall() {
        const [dataZuggrif] = await Promise.all([
          $api.outlet.getZugriff('checkPermission', {
            arrayNr: arrayNr,
            expectedNr: expectedNr,
            userInit:  dataStoreLogin['userInit']
          }),
        ]);

        if (dataZuggrif) {
          const responseZuggrif = dataZuggrif || [];
          const okFlag = responseZuggrif['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }

          // console.log('responseZuggrif : ' + flagCheck, responseZuggrif);
          // console.log('state.dataTable', state.dataTable);
          zuggrifval = responseZuggrif['zugriff'];

          if (zuggrifval == "true") {
            if (flagCheck == "getPrepare") {
              getSubgroup();
            } else if (flagCheck == "checkOpenDiscount") {
              state.isLoading = false;

              if (state.dataTable.hasOwnProperty('dataThBill')) {
                if (state.dataTable['dataThBill'] != 0 && state.dataTable['saldo'] != 0) {
                  onDialogDiscountBill(true);
                } else {
                  Notify.create({
                    message: 'Bill not found or saldo already balance',
                    type: 'warning',
                  });
                  state.isLoading = false;
                  return false;
                }
              } else {
                  Notify.create({
                    message: 'Bill not found',
                    type: 'warning',
                  });
              }
            } else if (flagCheck == 'closebill') {
              onDialogCloseBill(true, null);
            } else if (flagCheck == 'voiditem') {
              //prepareCancelOrderBL
              getRestInvCancelOrder();
            }
          } else {
            Notify.create({
              message: responseZuggrif['messStr'],
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getRestInvPayCash2 = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvPayCash2', {
            recId : state.dataTable['dataThBill'][0]['rec-id'],
            transdate: date.formatDate((new Date(state.billDate)), 'MM/DD/YY'),
            currDept : state.currDept,
            discArt1: state.dataPrepare['discArt1'],
            discArt2: state.dataPrepare['discArt1'],
            discArt3: state.dataPrepare['discArt1'],
            kelnerNr: state.dataPrepare['tKellner']['t-kellner'][0]['kellner-nr'],
          })
        ]);
        
        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];

          // console.log('restInvPayCash2 : ', responsePrepare);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (responsePrepare['flCode'] == 0) {
            state.dataTable = {};
            
            state.dataTable['saldo'] = 0;
            state.dataOrdered = [];
            state.dataNewOrder = [];
            state.dataTable['belegung'] = 0;
            state.dataTable['bezeich'] = '';
            state.dataTable['bilname'] = '';
            state.qty = 1;
            state.objRequestInvUpdateBill = {};
            state.flagRefreshAfterAction = false;
            onDialogTablePlan(true);
          }

         
          state.isLoading = false;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getAddKitchpr = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('addKitchenPrinter', {
            pvlLanguage : '1',
            sessionParameter: '',
            dept : state.currDept,
            rechnr: state.dataTable['dataThBill'][0]['rechnr'],
            billdate: date.formatDate((new Date(state.billDate)), 'MM/DD/YY'),
            userInit: '01',
          })
        ]);
        
        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];

          // console.log('addKitchenPrinter : ', responsePrepare);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (responsePrepare['errorStr'] != '') {
            Notify.create({
              message: responsePrepare['errorStr'],
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } else {
            if (state.flagPostingMenu) {
              checkBill(); 
            } 
          }
          state.isLoading = false;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getPrintBill = () => {
      console.log("print bill");
      
      if (state.paytype == 2) {
        onDialogTablePlan(true);          
      } else if (state.paytype == 1) {
        getBillLine();
      } else if (state.paytype == 11) {
        onDialogTablePlan(true);          
      } else if (state.paytype == 3) {
        if (state.tempFlCodePayment == 1) {
          onDialogTablePlan(true);
        } else if (state.tempFlCodePayment == 0) {
          getBillLine();
        }
      } else if (state.paytype == 7) {
        onDialogTablePlan(true);
      } else if (state.paytype == 8) {
        onDialogTablePlan(true);          
      }
    }

    const getSubgroup = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataSubgroup] = await Promise.all([
          $api.outlet.getOUPrepare('hblinePrepare', {
            userInit : dataStoreLogin['userInit'],
            dept : state.currDept,
            currRechnr : 0,
          }),
        ]);

        if (dataSubgroup) {
          const responseSubGroup = dataSubgroup || [];
          const okFlag = responseSubGroup['outputOkFlag'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
          state.dataSubGroup = [];
          state.dataFilteredSubGroup = [];
          {
            let tempDataSubGroup = responseSubGroup['grpList']['grp-list'];
            for (let i = 0; i<tempDataSubGroup.length; i++) {
              tempDataSubGroup[i]['selected'] = i === 0 ? true : false;
            }
            state.dataSubGroup = tempDataSubGroup;

            state.dataPrepare['billdate'] = tempDataSubGroup['billdate'];
          }

          if (state.dataSubGroup.length != 0) {
            getArticle();       
          }
          state.isLoading = false;
          // console.log("response subgr", responseSubGroup);
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getArticle = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataArticle] = await Promise.all([
          $api.outlet.getOUPrepare('restInvRunHelp', {
            kprTime : 0,
            kprRecid : 0,
            billDate : '',
            tischnr: state.dataTable['tischnr'],
            currDept: state.currDept
          }),
        ]);

        if (dataArticle) {
          const responseGetArticle = dataArticle || [];
          const okFlag = responseGetArticle['outputOkFlag'];

          // console.log('responseGetArticle : ', responseGetArticle);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (responseGetArticle['flCode'] === 1) {
             Notify.create({
              message: 'Please check, Kitchen Printer Program might not be running',
              type: 'warning'
            });
          }

          state.dataArticle = [];
          state.dataFilteredArticle = [];
          state.dataArticle = responseGetArticle['tHArtikel1']['t-h-artikel1'];
          // state.dataArticle.sort(compare);
          state.dataArticle.sort(function(a, b) { return (a['bezeich'] > b['bezeich']) ? 1 : ((b['bezeich'] > a['bezeich']) ? -1 : 0);} );
          {
            state.dataFilteredSubGroup = state.dataSubGroup;

            let initZknr;
            for (let i = 0; i<state.dataFilteredSubGroup.length; i++) {
              if (i === 0) {
                initZknr = state.dataFilteredSubGroup[i]['zknr'];
                break;
              }
            }

            for (let i = 0; i<state.dataArticle.length; i++) {
              const dataRow = state.dataArticle[i];

              if (dataRow['zwkum'] === initZknr) {
                state.dataFilteredArticle.push(dataRow);
              }
            }
          }
          state.isLoading = false;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const checkBill = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataCheckBill] = await Promise.all([
          $api.outlet.getOUPrepare('restInvCheckBill', {
            caseType : 1,
            tischnr : state.dataTable['tischnr'],
            currDept: state.currDept
          })
        ]);

         if (dataCheckBill) {
          const responseCheckBill = dataCheckBill || [];
          const okFlag = responseCheckBill['outputOkFlag'];

          // console.log('responseCheckBill : ', responseCheckBill);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          const dataThBill = responseCheckBill['tHBill']['t-h-bill'];
          for (let i = 0; i<dataThBill.length; i++) {
            if (dataThBill[i]['rechnr'] == state.dataTable['rechnr']) {
              state.dataPrepare['objCheckBill'] = dataThBill[i];
              break;
            }
          }

          state.dataTable['dataThBill'] = dataThBill;

          if (dataThBill.length > 0) {
            state.dataTable['rechnr'] = dataThBill[0]['rechnr'];
          }

          getBillLine();
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }    
    
    const getHTParam = (caseType, inp) => {
      state.isLoading = true;

      async function asyncCall() {
        const [gethtparam] = await Promise.all([
          $api.outlet.getCommonOutletUserList('getHTParam0', {
            casetype : caseType,
            inpParam: inp
          })
        ]);

        if (gethtparam) {
          const responseHTParam = gethtparam || [];
          const okFlag = responseHTParam['outputOkFlag'];

          console.log('responseHTParam ' , inp , ' : ', responseHTParam);

          if (inp == 60) {
            getPrepare(responseHTParam['fint']);
            getHTParam(2, 87);
          } else if (inp == 87) {
            state.billDate = responseHTParam['fdate'];
          }

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getPrepare = (currPrinter) => {
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvPrepare', {
            pvlLanguage: '1',
            currDept : state.currDept,
            currPrinter : '99',
            userInitStr: dataStoreLogin['userInit'],
            transdate: date.formatDate((new Date), 'MM/DD/YY'),
          })
        ]);
        
        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          state.dataPrepare = responsePrepare;
          const okFlag = responsePrepare['outputOkFlag'];
          const msgStr = responsePrepare['msgStr'];
          responsePrepare['currDept'] = state.currDept;

          // console.log('responsePrepare : ', responsePrepare);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (msgStr != "") {
            Notify.create({
              message: msgStr,
              color: 'red',
            });
          }

          state.restaurant = responsePrepare['deptname'];
            // true menu order taker dapat di klik/ enable visca versa
          if (responsePrepare['miOrdertaker'] == 'true') {
            state.flagOrderTakerDisable = false
          } else {
            state.flagOrderTakerDisable = true
          }

          if (responsePrepare['doubleCurrency'] == "true") {
            //
          }

          if (responsePrepare['flCode'] == 1) {
            
          } else {
            const bTitle = "abc;def";
            var strBtitle = bTitle.split(";");
            responsePrepare['btitleMicrosFlag'] = strBtitle[1];
            responsePrepare['btitleTitle'] = strBtitle[0];
            // console.log(responsePrepare);

            zuggriff(19, 2, "getPrepare");

            onDialogTablePlan(true);
          }
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
        state.isLoading = false;
      }
      asyncCall();
    }

    const getBillLine = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataBillLine] = await Promise.all([
          $api.outlet.getOUPrepare('restInvDispBillLine', {
            doubleCurrency : false,
            rechnr: state.dataTable['rechnr'],
            currDept: state.currDept,
            availTHBill: true,
          })
        ]);

         if (dataBillLine) {
          const responseGetBillLine = dataBillLine || [];
          const okFlag = responseGetBillLine['outputOkFlag'];

          console.log('responseGetBillLine : ', responseGetBillLine);

          state.dataOrdered = responseGetBillLine['tHBillLine']['t-h-bill-line'];

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (state.flagFirstLoad == 0) {
            if (!state.flagRefreshAfterAction) {
              if (!state.isCancel) {
                if (state.dataOrdered.length == 0) {
                  onDialogMenuOrderTaker(true, null);
                }
              } else {
                state.isCancel = false;
              }
            }
          } else {
            if (state.dataOrdered.length == 0) {
              onDialogTablePlan(true);
            }
          }
          state.isLoading = false;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getHBLineSelectItem = (datarows) => {
      // state.isLoading = true;

      async function asyncCall() {
        const [dataSelectItem] = await Promise.all([
          $api.outlet.getOUPrepare('hblineSelectItem ', {
            pvILanguage : 1,
            dept : state.currDept,
            helpFlag: true,
            artListArtnr: datarows['artnr'],
          })
        ]);

         if (dataSelectItem) {
          const responseSelectItem = dataSelectItem || [];
          const okFlag = responseSelectItem['outputOkFlag'];

          // console.log('responseSelectItem : ', responseSelectItem);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          } 
          state.dataValidationSelectArticle['responseSelectItem'] = responseSelectItem;

          getHBLineGetPrice(datarows);
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getHBLineGetPrice = (datarows) => {
      async function asyncCall() {
        const [dataGetPrice] = await Promise.all([
          $api.outlet.getOUPrepare('hblineGetPrice ', {
            pvILanguage : 1,
            dept : state.currDept,
            artListArtnr: datarows['artnr'],
          })
        ]);

        if (dataGetPrice) {
          const responseGetPrice = dataGetPrice || [];
          const okFlag = responseGetPrice['outputOkFlag'];

          // console.log('responseGetPrice : ', responseGetPrice);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          } 

          state.dataValidationSelectArticle['responseGetPrice'] = responseGetPrice;
          getHBLineSelectItem2(datarows);
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getHBLineSelectItem1 = (datarows) => {
      // state.isLoading = true;

      async function asyncCall() {
        const [dataSelectItem] = await Promise.all([
          $api.outlet.getOUPrepare('hblineSelectItem1 ', {
            dept : state.currDept,
            billdate: state.dataPrepare['billdate'],
            currRechnr: state.dataTable['rechnr'],
          })
        ]);

        if (dataSelectItem) {
          const responseSelectItem = dataSelectItem || [];
          const okFlag = responseSelectItem['outputOkFlag'];

          // console.log('responseSelectItem1 : ', responseSelectItem);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          } 

          state.dataValidationSelectArticle['responseSelectItem1'] = responseSelectItem;
          readDataClickPerArticle(datarows);
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getRestInvCheckSaldo = (flag) => {
      // state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvCheckSaldo ', {
            dept : state.currDept,
            rechnr: state.dataTable['rechnr'],
            saldo: state.dataTable['saldo'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          // console.log('response restInvCheckSaldo: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          } 
          getRestInvGetSaldo(flag);
          // state.isLoading = true;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getRestInvGetSaldo = (flag) => {
      // state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvGetSaldo ', {
            dept : state.currDept,
            rechnr: state.dataTable['rechnr'],
          })
        ]);

        if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          // console.log('response restInvGetSaldo: ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.dataTable['saldo'] = response['amount'];

          if (state.dataTable['saldo'] == 0) {
            Notify.create({
              message: 'Bill not found or balance already 0',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          } else {
            if (flag == 'tabletransfer') {
              state.showConfirmationDialog = true;
            } else if (flag == 'splitbill') {
              onDialogSplitBill(true, '');
            }
          }
          // state.isLoading = false;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          }
      }
      asyncCall();
    }

    const getHBLineSelectItem2 = (datarows) => {
      // state.isLoading = true;

      async function asyncCall() {
        const [dataSelectItem] = await Promise.all([
          $api.outlet.getOUPrepare('hblineSelectItem2 ', {
            dept : state.currDept,
            artListArtnr: datarows['artnr'],         
          })
        ]);

        if (dataSelectItem) {
          const responseSelectItem = dataSelectItem || [];
          const okFlag = responseSelectItem['outputOkFlag'];

          // console.log('responseSelectItem2 : ', responseSelectItem);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          } 
          state.dataValidationSelectArticle['responseSelectItem2'] = responseSelectItem;
          getHBLineSelectItem1(datarows);
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const readDataClickPerArticle = (datarows) => {
      state.tempDataRowSelectedArticle = {
          'abbuchung' : datarows['abbuchung'],
          'activeflag' : datarows['activeflag'],
          'aenderwunsch' : datarows['aenderwunsch'],
          'artart' : datarows['artart'],
          'artnr' : datarows['artnr'],
          'artnrfront' : datarows['artnrfront'],
          'artnrlager' : datarows['artnrlager'],
          'artnrrezept' : datarows['artnrrezept'],
          'autosaldo': datarows['autosaldo'],
          'betriebsnr': datarows['betriebsnr'],
          'bezaendern': datarows['bezaendern'],
          'bezeich': datarows['bezeich'],
          'bondruckernr': datarows['bondruckernr'],
          'departement': datarows['departement'],
          'e-gueltig': datarows['e-gueltig'],
          'endkum': datarows['endkum'],
          'epreis1': datarows['epreis1'],
          'epreis2': datarows['epreis2'],
          'gang': datarows['gang'],
          'lagernr': datarows['lagernr'],
          'mwst-code': datarows['mwst-code'],
          'position': state.dataNewOrder.length,
          'prozent': datarows['prozent'],
          'rec-id': datarows['rec-id'],
          's-gueltig': datarows['s-gueltig'],
          'service-code': datarows['service-code'],
          'qty': state.qty,
          'remark': "",
          'zwkum': datarows['zwkum'],
          'dataremark': [],
          'customRemark': ""
      };

      state.dataValidationSelectArticle['tempPrice'] = null;
      state.pass = state.dataValidationSelectArticle['responseSelectItem2']['param172'];
      
      console.log("dataValidationSelectArticle : ", state.dataValidationSelectArticle);

      if (state.dataValidationSelectArticle['responseGetPrice']['err'] == "true") {
        onDialogInputPrice(true, 0);
        return false;
      }

      if (state.dataValidationSelectArticle['responseGetPrice']['err1'] == "true") {
        onDialogInputMultiple(true, 0);
        return false;
      }

      if (state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['betriebsnr'] != 0) {
        onDialogSelectMenuItem(true, null);
        return false;
      }

      if (state.dataValidationSelectArticle['responseSelectItem2']['tHArtikel']['t-h-artikel'][0]['bezaendern']) {
        onDialogInputDescription(true, null);
        return false;
      }

      initDataClickMenu();
    }

    const restInvUpdateBill1 = (flag) => {
      state.isLoading = true;

      // console.log('data : ', data);

      // console.log({
      //       pvILanguage : 1,
      //       recId: data['dataThBill'][0]['rec-id'],
      //       recIdHArtikel :data['dataPayment']['tHArtikel']['t-h-artikel'][0]['rec-id'],
      //       deptname :state.dataPrepare['deptname'],
      //       transdate: date.formatDate((new Date), 'MM/DD/YY'),
      //       hArtart :data['dataPayment']['dataSelected']['artart'],
      //       cancelOrder :'false',
      //       hArtikelServiceCode :state.dataTable['dataPayment']['dataSelected']['service-code'],
      //       amount: -state.dataTable['dataThBill'][0]['saldo'],
      //       amountForeign:-state.dataTable['dataThBill'][0]['saldo'],
      //       price: 0,
      //       doubleCurrency: state.dataPrepare['doubleCurrency'],
      //       qty: 1,
      //       exchgRate:state.dataPrepare['exchgRate'],
      //       priceDecimal:state.dataPrepare['priceDecimal'],
      //       orderTaker:state.dataPrepare['dataSelectedOrderTaker'] == null ? '1' : state.dataPrepare['dataSelectedOrderTaker'],
      //       tischnr:state.dataTable['tischnr'],
      //       currDept:state.dataPrepare['currDept'],
      //       currWaiter:state.dataPrepare['currWaiter'],
      //       gname:state.dataTable['bilname'],
      //       pax:state.dataTable['belegung'],
      //       kreditlimit: data['klimit'],
      //       addZeit: 1,
      //       billart: state.dataTable['dataPayment']['billart'],
      //       description:  state.dataTable['dataPayment']['dataSelected']['bezeich'],
      //       changeStr:' ',
      //       ccComment:' ',
      //       cancelStr:' ',
      //       reqStr:' ',
      //       voucherStr:' ',
      //       hogaCard:' ',
      //       printToKitchen:'true',
      //       fromAcct:'false',
      //       hArtnrfront: data['dataPayment']['dataSelected']['artnrfront'],
      //       payType:0,
      //       guestnr:0,
      //       transferZinr:' ',
      //       curedeptFlag:'false',
      //       foreignRate:'false',
      //       currRoom:' ',
      //       userInit:dataStoreLogin['userInit'],
      //       hogaResnr:0,
      //       hogaReslinnr:0,
      //       inclVat:'false',
      //       getPrice:'0',
      //       mcStr:'0',
      //       'submenuList': {'submenu-list' : [{
      //         "menurecid": 0,
      //         "zeit": 0,
      //         "nr": 0,
      //         "artnr": 0,
      //         "bezeich": " ",
      //         "anzahl": 0,
      //         "zknr": 0,
      //         "request": " "
      //       }]},
      //     })

      async function asyncCall() {
        const [dataFetch] = await Promise.all([
          $api.outlet.getOUPrepare('restInvUpdateBill1', state.objRequestInvUpdateBill)
        ]);

        if (dataFetch) {
          const response = dataFetch || [];
          const okFlag = response['outputOkFlag'];

          console.log('response restInvUpdateBill1 : ', response);
          console.log('data Table : ', state.dataTable);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          const saldo = response['balance'];

          if (response['tHBill']['t-h-bill'].length > 0) {
            const flagCode = response['tHBill']['t-h-bill'][0]['flag'];
            state.tempFlCodePayment = flagCode;
  
            if (flag == 'card') {
              if (flagCode == 1) {
                state.dataTable = {};

                state.dataTable['saldo'] = saldo;
                state.dataOrdered = [];
                state.dataNewOrder = [];
                state.dataTable['belegung'] = 0;
                state.dataTable['bezeich'] = '';
                state.dataTable['bilname'] = '';
                state.qty = 1;
                state.objRequestInvUpdateBill = {};
                state.flagRefreshAfterAction = false;
                
                if (state.askKpr) {
                  state.showDialogKpr = true;
                } else {
                  onDialogTablePlan(true);
                }
              }
            } else if (flag == 'cash') {
              if (flagCode == 0) {
                state.dataTable['saldo'] = saldo;
                state.flagRefreshAfterAction = true;

                if (state.askKpr) {
                  state.showDialogKpr = true;
                } else {
                  getBillLine();
                }
              }
            } else if (flag == 'cityledger') {
              if (flagCode == 1) {
                state.dataTable = {};

                state.dataTable['saldo'] = saldo;
                state.dataOrdered = [];
                state.dataNewOrder = [];
                state.dataTable['belegung'] = 0;
                state.dataTable['bezeich'] = '';
                state.dataTable['bilname'] = '';
                state.qty = 1;
                state.objRequestInvUpdateBill = {};
                state.flagRefreshAfterAction = false;

                if (state.askKpr) {
                  state.showDialogKpr = true;
                } else {
                  onDialogTablePlan(true);
                }
              } else if (flagCode == 0) {
                state.dataTable['saldo'] = saldo;
                state.flagRefreshAfterAction = true;

                if (state.askKpr) {
                  state.showDialogKpr = true;
                } else {
                  getBillLine();
                }
              }
            } else if (flag == 'compliment') {
              if (flagCode == 1) {
                state.dataTable = {};

                state.dataTable['saldo'] = saldo;
                state.dataOrdered = [];
                state.dataNewOrder = [];
                state.dataTable['belegung'] = 0;
                state.dataTable['bezeich'] = '';
                state.dataTable['bilname'] = '';
                state.qty = 1;
                state.objRequestInvUpdateBill = {};
                state.flagRefreshAfterAction = false;

                if (state.askKpr) {
                  state.showDialogKpr = true;
                } else {
                  onDialogTablePlan(true);
                }
              }
            } else if (flag == 'mealcoupon') {
               if (flagCode == 1) {
                state.dataTable = {};

                state.dataTable['saldo'] = saldo;
                state.dataOrdered = [];
                state.dataNewOrder = [];
                state.dataTable['belegung'] = 0;
                state.dataTable['bezeich'] = '';
                state.dataTable['bilname'] = '';
                state.qty = 1;
                state.objRequestInvUpdateBill = {};
                state.flagRefreshAfterAction = false;

                if (state.askKpr) {
                  state.showDialogKpr = true;
                } else {
                  onDialogTablePlan(true);
                }
              }
            } else if (flag == 'cancel') {
              state.dataTable['saldo'] = saldo;
              state.dataNewOrder = [];
              state.objRequestInvUpdateBill = {};
              state.flagRefreshAfterAction = false;
              state.isCancel = true;
              
              getBillLine();
            }
          }

          state.isLoading = false;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          }
      }
      asyncCall();
    }

    const getRestInvNotBalance = () => {
      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvNotBalanceBill', {
            pvlLanguage: '1',
            currDept : state.currDept,
          })
        ]);
        
        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];
          const msgStr = responsePrepare['msgStr'];

          // console.log('restInvNotBalanceBill : ', responsePrepare);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          } 

          if (msgStr != "") {
            Notify.create({
              message: msgStr,
              color: 'red',
            });
            // state.isLoading = false;
          }
          onDialogChangeOutlet(true, '', 'closebill');
          state.isLoading = false;
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getRestInvCancelOrder = () => {
      // state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvCancelOrder', {
            hBlineRecId : state.dataSelected['rec-id'],
            zugriff: true,
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          console.log('restInvCancelOrder : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          }

          state.dataSelected['recIdHArt'] = response['recIdHArt'];
          state.dataSelected['cancelFlag'] = response['cancelFlag'];
          state.dataSelected['pricePrepare'] = response['price'];
          state.dataSelected['qtyPrepare'] = response['qty'];
          state.dataSelected['flCode1'] = response['flCode1'];
          state.dataSelected['anz'] = response['anz'];
          state.dataSelected['prepareArticle'] = response['tHArtikel']['t-h-artikel'][0];

          // const flCode1 = response['flCode1'];
          // const flCode2 = response['flCode2'];
          // if (flCode1 == 1 || flCode2 == 1) {
          //     onDialogVoidItem(true, '', null);            
          // }


          if (response['tHArtikel']['t-h-artikel'].length > 0) {
            if (response['tHArtikel']['t-h-artikel'][0]['artart'] == 0) {
              state.tempDataPayment = response;

              onDialogVoidItem(true, '', null);
            }
          }
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getRestInvOpenStandTable = () => {
      // state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvOpenStandTable', {
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          // console.log('restInvOpenStandTable : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          }

          const flCode = response['flCode'];
          if (flCode == 1) {
            state.titleDialogStandingTable = 'Standing table not define';
            state.showDialogStandingTableNotDefined = true;
          } else if (flCode == 2) {
            state.titleDialogStandingTable = 'No vacant standing table available';
            state.showDialogStandingTableNotDefined = true;
          }
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getRestInvWaiterTransfer = () => {
      // state.isLoading = true;

      async function asyncCall() {
        const [data] = await Promise.all([
          $api.outlet.getOUPrepare('restInvWaiterTransfer', {
            currDept: state.currDept,
          })
        ]);

         if (data) {
          const response = data || [];
          const okFlag = response['outputOkFlag'];

          // console.log('restInvWaiterTransfer : ', response);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
          }
          onDialogCashierTransfer(true);
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            // state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const getRestInvRunHelp4 = () => {
      console.log('Request : ', {
            kprTime : 0,
            kprRecid: 0,
            billDate: date.formatDate((new Date), 'MM/DD/YY'),
            currDept : state.currDept,
            tischnr : state.dataTable['tischnr'],
            amount: 0
          });

      state.isLoading = true;

      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvRunHelp4', {
            kprTime : 0,
            kprRecid: 0,
            billDate: date.formatDate((new Date), 'MM/DD/YY'),
            currDept : state.currDept,
            tischnr : state.dataTable['tischnr'],
            amount: 0
          })
        ]);
        
        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];
          const flCode = responsePrepare['flCode'];

          console.log('restInvRunHelp4 : ', responsePrepare);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          if (flCode == "true") {
            Notify.create({
              message: 'Please check, Kitchen Printer Program might not be running!!',
              color: 'red',
            });
          } 
          else {
            state.askKpr = true;
          }

          getRestInvPostingMenu();
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }
    
    const getRestInvPostingMenu  = () => {
      // state.flagFirstLoad = 1;

      const menu = [];
      for (let i = 0; i<state.dataNewOrder.length; i++) {
        const datarow = state.dataNewOrder[i];
        const obj = {};
        obj['request'] = datarow['remark'] == "" ? " " : datarow['remark'];
        obj['krecid'] = datarow['rec-id'];
        obj['posted'] = true;
        obj['nr'] = i + 1;
        obj['artnr'] = datarow['artnr'];
        obj['bezeich'] = datarow['bezeich'];
        obj['anzahl'] = datarow['qty'];
        obj['price'] = datarow['epreis1'],
        obj['betrag'] = datarow['qty'] * datarow['epreis1'],
        obj['voucher'] = ' ',
        menu.push(obj);
      }
      
      console.log("request posting : ", {
            caseType: 1, 
            pvlLanguage: 0,
            tischnr: state.dataTable['tischnr'],
            currDept : state.currDept,
            cancelReason: " ",
            doubleCurrency: state.dataPrepare['doubleCurrency'],
            exchgRate: state.dataPrepare['exchgRate'],
            priceDecimal: state.dataPrepare['priceDecimal'],
            transdate: null,
            foreignRate: 'false',
            deptname: state.dataPrepare['deptname'],
            cancelOrder: 'false',
            orderTaker: state.dataPrepare['dataSelectedOrderTaker'] == null ? '1' : state.dataPrepare['dataSelectedOrderTaker'],
            currWaiter: state.dataPrepare['currWaiter'],
            gname: state.dataTable['bilname'] == '' || state.dataTable['bilname'] == undefined ? ' ' : state.dataTable['bilname'],
            pax: state.dataTable['belegung'],
            kreditlimit: state.dataTable['klimit'],
            changeStr: ' ',
            ccComment: ' ',
            hogaCard: ' ',
            printToKitchen: true,
            fromAcct: 'false',
            payType: 0,
            guestnr: 0,
            transferZinr: ' ',
            curedeptFlag: 'false',
            currRoom: ' ',
            userInit: '01',
            hogaResnr: 0, //no reservasi jika tamu inhouse
            hogaReslinnr: 0,  // no reservasi member jika tamu merupakan tamu inhouse
            inclVat : 'false', 
            getPrice: 0,
            mcStr: ' ',
            cancelFlag: 'false',
            'tpBediener' : {'tp-bediener': [{
                nr: 0,
                usercode: 0,
                userinit: 0,
                username: ' ',
                userGroup: ' ',
                permissions: ' ',
                betriebsnr: ' ',
                kassenbest: ' ',
                flag: ' ',
                mapiProfile: ' ',
                mapiPassword: ' ',
                char1: ' ',
            }]},
            'submenuList': {'submenu-list' : [{
              "menurecid": 0,
              "zeit": 0,
              "nr": 0,
              "artnr": 0,
              "bezeich": " ",
              "anzahl": 0,
              "zknr": 0,
              "request": " "
            }]},
            'menuList': {'menu-list': menu},
            'tHBill': {'t-h-bill': state.dataTable['dataThBill']}
          });

      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvPostingMenu', {
            caseType: 1, 
            pvlLanguage: 0,
            tischnr: state.dataTable['tischnr'],
            currDept : state.currDept,
            cancelReason: " ",
            doubleCurrency: state.dataPrepare['doubleCurrency'],
            exchgRate: state.dataPrepare['exchgRate'],
            priceDecimal: state.dataPrepare['priceDecimal'],
            transdate: null,
            foreignRate: 'false',
            deptname: state.dataPrepare['deptname'],
            cancelOrder: 'false',
            orderTaker: state.dataPrepare['dataSelectedOrderTaker'] == null ? '1' : state.dataPrepare['dataSelectedOrderTaker'],
            currWaiter: state.dataPrepare['currWaiter'],
            gname: state.dataTable['bilname'] == '' || state.dataTable['bilname'] == undefined ? ' ' : state.dataTable['bilname'],
            pax: state.dataTable['belegung'],
            kreditlimit: state.dataTable['klimit'],
            changeStr: ' ',
            ccComment: ' ',
            hogaCard: ' ',
            printToKitchen: true,
            fromAcct: 'false',
            payType: 0,
            guestnr: 0,
            transferZinr: ' ',
            curedeptFlag: 'false',
            currRoom: ' ',
            userInit: '01',
            hogaResnr: 0, //no reservasi jika tamu inhouse
            hogaReslinnr: 0,  // no reservasi member jika tamu merupakan tamu inhouse
            inclVat : 'false', 
            getPrice: 0,
            mcStr: ' ',
            cancelFlag: 'false',
            'tpBediener' : {'tp-bediener': [{
                nr: ' ',
                usercode: " ",
                userinit: ' ',
                username: ' ',
                userGroup: ' ',
                permissions: ' ',
                betriebsnr: ' ',
                kassenbest: ' ',
                flag: ' ',
                mapiProfile: ' ',
                mapiPassword: ' ',
                char1: ' '
            }]},
            'submenuList': {'submenu-list' : [{
              "menurecid": 0,
              "zeit": 0,
              "nr": 0,
              "artnr": 0,
              "bezeich": " ",
              "anzahl": 0,
              "zknr": 0,
              "request": " "
            }]},
            'menuList': {'menu-list': menu},
            'tHBill': {'t-h-bill': state.dataTable['dataThBill']}
          })
        ]);
        
        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];

          console.log('restInvPostingMenu  : ', responsePrepare);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.tabbillnumber = 'ordered';

          const dataBill = responsePrepare['tHBill']['t-h-bill'];
          if (dataBill.length > 0) {
            state.dataTable['dataThBill'] = dataBill;
            state.dataTable['saldo'] = dataBill[0]['saldo'];
            state.billDate = responsePrepare['billDate'];
            state.dataNewOrder = [];
            state.flagRefreshAfterAction = true;

            if (state.askKpr) {
              state.showDialogKpr = true;
            } else {
              checkBill(); 
            }
          } else if (responsePrepare['flCode2'] == 1) {
            Notify.create({
              message: 'Transaction not allowed; Posted item(s) with different billing date found.',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } else if (responsePrepare['flCode4'] == 1) {
            if (state.dataPrepare['doubleCurrency']) {

            }
            checkBill();
          } else if (responsePrepare['flCode5'] == 1) {
            state.flagPrintOrderCheckerEnable = true;

            checkBill();
          } else if (responsePrepare['flCode3'] == 1) {
            // Run TS Voucher UI
             checkBill();
          } else if (responsePrepare['flCode2'] == 2 && responsePrepare['availBill']) {
            state.isLoading = false;
            state.showDialogMergeBill = true;          
          } else {

          }
        } else {
          Notify.create({
            message: 'Please check your internet connection',
            color: 'red',
          });
          state.isLoading = false;
          return false;
        }
      }
      asyncCall();
    }

    const getRestInvOpenTable = () => {
      state.isLoading = true;

      async function asyncCall() {
        const [dataPrepare] = await Promise.all([
          $api.outlet.getOUPrepare('restInvOpenTable', {
            gname : ' ',
            room: ' ',
            userInit: ' ',
            fromAcct: false,
            currDept : state.currDept,
            tischnr : state.dataTable['tischnr'],
            balance: '?',
            curedeptFlag: false,
            userName: ' ',
          })
        ]);
        
        if (dataPrepare) {
          const responsePrepare = dataPrepare || [];
          const okFlag = responsePrepare['outputOkFlag'];

          console.log('restInvOpenTable : ', responsePrepare);

          if (!okFlag) {
            Notify.create({
              message: 'Failed when retrive data, please try again',
              color: 'red',
            });
            state.isLoading = false;
            return false;
          } 

          state.dataTable['dataThBill'] = responsePrepare['tHBill']['t-h-bill'];
          state.dataTable['bilname'] = responsePrepare['tHBill']['t-h-bill'][0]['bilname'];
          state.dataTable['belegung'] = responsePrepare['tHBill']['t-h-bill'][0]['belegung'];
          state.dataTable['tischnr'] = responsePrepare['tHBill']['t-h-bill'][0]['tischnr'];

          getRestInvPostingMenu();
        } else {
          Notify.create({
              message: 'Please check your internet connection',
              color: 'red',
            });
            state.isLoading = false;
            return false;
        }
      }
      asyncCall();
    }

    const initDataClickMenu = () => {
      state.dataNewOrder.push({
          'abbuchung' : state.tempDataRowSelectedArticle['abbuchung'],
          'activeflag' : state.tempDataRowSelectedArticle['activeflag'],
          'aenderwunsch' : state.tempDataRowSelectedArticle['aenderwunsch'],
          'artart' : state.tempDataRowSelectedArticle['artart'],
          'artnr' : state.tempDataRowSelectedArticle['artnr'],
          'artnrfront' : state.tempDataRowSelectedArticle['artnrfront'],
          'artnrlager' : state.tempDataRowSelectedArticle['artnrlager'],
          'artnrrezept' : state.tempDataRowSelectedArticle['artnrrezept'],
          'autosaldo': state.tempDataRowSelectedArticle['autosaldo'],
          'betriebsnr': state.tempDataRowSelectedArticle['betriebsnr'],
          'bezaendern': state.tempDataRowSelectedArticle['bezaendern'],
          'bezeich': state.tempDataRowSelectedArticle['bezeich'],
          'bondruckernr': state.tempDataRowSelectedArticle['bondruckernr'],
          'departement': state.tempDataRowSelectedArticle['departement'],
          'e-gueltig': state.tempDataRowSelectedArticle['e-gueltig'],
          'endkum': state.tempDataRowSelectedArticle['endkum'],
          'epreis1': state.tempDataRowSelectedArticle['epreis1'],
          'epreis2': state.tempDataRowSelectedArticle['epreis2'],
          'gang': state.tempDataRowSelectedArticle['gang'],
          'lagernr': state.tempDataRowSelectedArticle['lagernr'],
          'mwst-code': state.tempDataRowSelectedArticle['mwst-code'],
          'position': state.dataNewOrder.length,
          'prozent': state.tempDataRowSelectedArticle['prozent'],
          'rec-id': state.tempDataRowSelectedArticle['rec-id'],
          's-gueltig': state.tempDataRowSelectedArticle['s-gueltig'],
          'service-code': state.tempDataRowSelectedArticle['service-code'],
          'qty': state.qty,
          'remark': "",
          'zwkum': state.tempDataRowSelectedArticle['zwkum'],
          'dataremark': [],
          'customRemark': ""
      });
      state.qty = 1;
      state.tempDataRowSelectedArticle = {};
      console.log('New Order List : ', state.dataNewOrder);
    }


    // Delegate Listener
    const onResultTablePlan = (result) => {
      // console.log('result table plan: ', result);
      state.dataTable = result;
      checkBill();

      if (state.dataSubGroup.length == 0 || state.dataArticle.length == 0) {
        getSubgroup();
      }
    }

    // Private Utils 
    function compare(a, b) {
      if (a['bezeich'] < b['bezeich'] ){
        return -1;
      }
      if ( a['bezeich'] > b['bezeich'] ){
        return 1;
      }
      return 0;
    }

    const showKeyboardSearch = (e) => {
      if (e.target.localName == "input") {
        state.inputbottom = e.target; 
      } 

      if (!state.keyboardVisible) {
        state.keyboardVisible = true;
      }       
    }

    const showKeyboardQty = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
      } 
    }

    const hideKeyboard = () => {
      state.keyboardVisible = false;
    }

    const onChangeSearchInput = (input) => {
      state.dataFilteredArticle = [];

      if (state.text.length > 0) {
        for(let i = 0; i<state.dataArticle.length; i++) {
          const datarow = state.dataArticle[i];
          const bezeich = state.dataArticle[i]['bezeich'] as string;

          if (bezeich.toLocaleLowerCase().includes(state.text.toLocaleLowerCase())) {
            state.dataFilteredArticle.push(datarow);
          }
        }
      } else {
        state.dataFilteredArticle = state.dataArticle;
      }
    }

    const onClickCashierTransfer = () => {
      getRestInvWaiterTransfer();
    }

    const onDialogCashierTransfer = (val) => {
      state.showDialogCashierTransfer = val;
    }

    const onDialogCloseBill = (val, data) => {
      state.showDialogCloseBill = val;

      if (!val && data != null) {

      }
    }

    const onClickChangeOutlet = () => {
      getRestInvNotBalance();
    }

    const onDialogChangeOutlet = (val, flag, data) => {
      state.showDialogChangeOutlet = val;
      if(!val && flag == 'ok') {
        state.currDept = data['currDept'];
        state.dataPrepare['currDept'] = data['currDept'];
        state.dataPrepare['deptname'] = data['deptname'];
        state.dataPrepare['bTitle'] = data['bTitle'];
        state.restaurant = state.dataPrepare['deptname'];
        state.dataNewOrder = [];
        state.dataOrdered = [];
        state.dataTable = {};

        getHTParam(4, 60);

        // console.log('on result change outlet : ', state.dataPrepare);
        // onDialogTablePlan(true);
      }
    }

    const onClickVoidItem = (datarow) => {
      console.log('data article selected : ', datarow);
      state.dataSelected = datarow;

      if (state.dataSelected['anzahl'] > 0 && state.dataSelected['artnr'] != 0) {
        zuggriff(52, 2, 'voiditem');
      }
      // console.log(state.dataSelected);
    }

    const onDialogVoidItem = (val, flag, data) => {
      state.showDialogVoidItem = val;

      if (flag == 'ok') {
        state.dataTable['dataPayment'] = data;
        console.log('onResultVoid : ', state);
        console.log('data : ', data)

        state.objRequestInvUpdateBill = {
            pvILanguage : 1,
            recId: state.dataTable['dataThBill'][0]['rec-id'],
            // recIdHArtikel :state.dataTable['dataPayment']['rec-id'],
            recIdHArtikel : 0,
            deptname :state.dataPrepare['deptname'],
            transdate: '',
            // transdate: date.formatDate((new Date), 'MM/DD/YY'),
            // hArtart :state.dataTable['dataPayment']['artart'],
            hArtart :1,
            cancelOrder :'false',
            hArtikelServiceCode :state.tempDataPayment['tHArtikel']['t-h-artikel'][0]['service-code'],
            amount: -(state.tempDataPayment['tHArtikel']['t-h-artikel'][0]['betrag'] * state.tempDataPayment['tHArtikel']['t-h-artikel'][0]['qty']),
            amountForeign: -(state.tempDataPayment['tHArtikel']['t-h-artikel'][0]['betrag'] * state.tempDataPayment['tHArtikel']['t-h-artikel'][0]['qty']),
            price: state.tempDataPayment['tHArtikel']['t-h-artikel'][0]['epreis1'],
            doubleCurrency: state.dataPrepare['doubleCurrency'],
            qty: -state.tempDataPayment['tHArtikel']['t-h-artikel'][0]['qty'],
            exchgRate:state.dataPrepare['exchgRate'],
            priceDecimal:state.dataPrepare['priceDecimal'],
            orderTaker:state.dataPrepare['dataSelectedOrderTaker'] == null ? '1' : state.dataPrepare['dataSelectedOrderTaker'],
            tischnr:state.dataTable['tischnr'],
            currDept:state.dataPrepare['currDept'],
            currWaiter:state.dataPrepare['currWaiter'],
            gname:state.dataTable['bilname'] == '' ? ' ' : state.dataTable['bilname'],
            pax:state.dataTable['belegung'],
            kreditlimit: state.dataTable['klimit'],
            addZeit: 1,
            billart: state.tempDataPayment['billart'],
            description:  state.tempDataPayment['description'],
            changeStr:' ',
            ccComment:' ',
            cancelStr: state.tempDataPayment['tHArtikel']['t-h-artikel'][0]['cancelStr'],
            reqStr:' ',
            voucherStr:' ',
            hogaCard:' ',
            printToKitchen:'true',
            fromAcct:'false',
            hArtnrfront: state.tempDataPayment['tHArtikel']['t-h-artikel'][0]['artnrfront'],
            payType:0,
            guestnr:0,
            transferZinr:' ',
            curedeptFlag:'false',
            foreignRate:'false',
            currRoom:' ',
            userInit:dataStoreLogin['userInit'],
            hogaResnr:0,
            hogaReslinnr:0,
            inclVat:'false',
            getPrice: 0,
            mcStr:'0',
            'submenuList': {'submenu-list' : [{
              "menurecid": 0,
              "zeit": 0,
              "nr": 0,
              "artnr": 0,
              "bezeich": " ",
              "anzahl": 0,
              "zknr": 0,
              "request": " "
            }]},
          }
        console.log('request : ', state.objRequestInvUpdateBill);

        restInvUpdateBill1('cancel');
      }
    }

    useExtraMenu([
      {
        handler: () => onDialogTablePlan(true),
        icon: 'OU/Icon-SelectTable',
      },
      {
        handler: () => onClickCashierTransfer(),
        icon: 'OU/Icon-CashierTransfer',
      },
      {
        handler: () => zuggriff(49, 1, 'closebill'),
        icon: 'OU/Icon-ClosedBill',
      },
      {
        handler: () => onClickChangeOutlet(),
        icon: 'OU/Icon-ChangeOutlet',
      },
      {
        handler: () => onClickDialogChangeUser(),
        icon: 'OU/collage/ChangeUser',
      },
      {
        handler: () => getRestInvOpenStandTable(),
        icon: 'OU/collage/StandingMode',
      },
    ]);

    return {
      dataStoreLogin,
      ...toRefs(state),
      tab: 'variant',
      tabbill: 'calc',
      lorem: 'Wastern Flavor',
      dense: false,
      zuggriff,
      checkBill,
      getArticle,
      getSubgroup,
      onClickSubGroup,
      onClickArticle,
      onClickNewOrder,
      onSplitItem,
      onDialogSelectOrderTaker,
      onDialogMenuOrderTaker,
      onDialogEditNewOrder,
      onDialogCancelEditNewOrder,
      onRemoveNewOrder,
      onDialogSplitItem,
      onDialogSplitBill,
      onClickConfirmNewOrder,
      onDialogPayment, 
      onClickPayment,
      onClickSplitBill,
      onClickDiscount,
      onDialogDiscountBill,
      onClickTableTransfer,
      onDialogTransferTable,
      onClickDialogSelectOrderTaker,
      onClickDialogChangeUser,
      onDialogChangeUser,
      onDialogTablePlan,
      onResultTablePlan,
      getHTParam,
      getPrepare,
      getBillLine,
      showKeyboardSearch,
      showKeyboardQty,
      hideKeyboard,
      onChangeSearchInput,
      getHBLineSelectItem,
      getHBLineGetPrice,
      onDialogInputPrice,
      onDialogInputMultiple,
      onDialogSelectMenuItem,
      onDialogInputDescription,
      onDialogInputPassword,
      onDialogCashierTransfer,
      onClickCashierTransfer,
      onDialogCloseBill,
      onClickChangeOutlet,
      onDialogChangeOutlet,
      onClickConfirmation,
      onDialogVoidItem,
      onClickVoidItem,
      getRestInvNotBalance,
      getRestInvOpenStandTable,
      getRestInvRunHelp4,
      getRestInvPostingMenu,
      onClickDialogKpr, 
      onClickMergeBill,
      getRestInvOpenTable,
      onClickPrintOrderChecker,

    };
  },
  components: {
    dialogSelectOrderTakers: () => import('./components/outlet_menu/DialogSelectOrderTaker.vue'),
    dialogNewOrder:() => import('./components/outlet_menu/DialogEditNewOrder.vue'),
    dialogSplitItem:() => import('./components/outlet_menu/DialogSplitItem.vue'),
    dialogPayment:() => import('./components/outlet_menu/payment/DialogPayment.vue'),
    dialogSplitBill:() => import('./components/outlet_menu/DialogSplitBill.vue'),
    dialogDiscountBill:() => import('./components/outlet_menu/DialogDiscountBill.vue'),
    dialogTransferTable:() => import('./components/outlet_menu/DialogTransferTable.vue'),
    dialogChangeUser:() => import('././components/outlet_menu/DialogChangeUser.vue'),
    dialogTablePlan:()=> import('./components/outlet_menu/table/DialogTablePlan.vue'),
    dialogInputPrice:()=> import('./components/outlet_menu/components_article/DialogInputPrice.vue'),
    dialogInputMultiple:()=> import('./components/outlet_menu/components_article/DialogInputMultiple.vue'),
    dialogSelectMenuItem:()=>import('./components/outlet_menu/components_article/DialogSelectMenuItem.vue'),
    dialogInputDescription:()=>import('./components/outlet_menu/components_article/DialogInputDescription.vue'),
    dialogInputPassword:()=>import('./components/outlet_menu/components_article/DialogInputPassword.vue'),
    dialogCashierTransfer:() => import('./components/outlet_menu/DialogCashierTransfer.vue'),
    dialogCloseBill:() => import('./components/outlet_menu/DialogCloseBill.vue'),
    dialogChangeOutlet:() => import('./components/outlet_menu/DialogChangeOutlet.vue'),
    dialogVoidItem:() => import('./components/outlet_menu/DialogVoidItem.vue'),
  },
});
</script>

<style lang="scss">
#keyboardbottom {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;

	z-index: 1000;
	width: 100%;
	max-width: 1000px;
	margin: 0 auto;

	padding: 1em;

	background-color: #EEE;
	box-shadow: 0px -3px 10px rgba(black, 0.3);

	border-radius: 10px;
}

</style>



