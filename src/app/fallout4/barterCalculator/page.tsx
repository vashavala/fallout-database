"use client";
import React, { useState } from "react"

export default function Page() {
  const [baseCharisma, setBaseCharisma] = useState(1)
  const [charismaBobblehead, setCharismaBobblehead] = useState(false)
  const [youreSPECIALBook, setYoureSPECIALBook] = useState(false)
  const [hasBarberChair, setHasBarberChair] = useState(false)
  const [wearingCharisma, setWearingCharisma] = useState(0)
  const [hasAlcohol, setHasAlcohol] = useState(false)
  const [hasPartyPerk, setHasPartyPerk] = useState(false)

  type Chem = {
    id: string,
    name: string,
    charisma: number,
    barterModifier?: number,
  }
  const CHEMS: Chem[] = [
    { id: "XCell", name: "X-cell", charisma: 2 },
    { id: "DayTripper", name: "Day Tripper", charisma: 3 },
    { id: "SmoothOperator", name: "Smooth Operator", charisma: 3, barterModifier: 1.1 },
    { id: "GrapeMentats", name: "Grape Mentats", charisma: 5, barterModifier: 1.1 },
  ] as const;
  const chemIds = CHEMS.map(chem => chem.id);
  type ChemId = (typeof chemIds)[number];
  const [pickedChems, setPickedChems] = useState<Chem[]>([])
  const [, , ...mantatsIds] = chemIds
  const toggleChem = (chemId: ChemId) => {
    // pickedChem already has it
    const idx = pickedChems.findIndex(chem => chem.id === chemId)
    if (idx > -1) {
      pickedChems.splice(idx, 1)
      setPickedChems([...pickedChems])
      return;
    }

    // pickedChem don't have it
    if (mantatsIds.includes(chemId)) {
      // chemId is about mantats
      const [anotherMantatsId] = mantatsIds.filter(id => id !== chemId)
      // find out if pickedChem contain another mantats
      const index = pickedChems.findIndex(chem => chem.id == anotherMantatsId)
      // if pickedChem already contain the another, splice it out before the new one get in
      if (index > -1) pickedChems.splice(index, 1)
    }
    const newChem = CHEMS.find(chem => chem.id === chemId) as Chem
    setPickedChems([...pickedChems, newChem])
  }

  const [capCollector, setCapCollector] = useState(0)
  const [barterBobblehead, setBarterBobblehead] = useState(false)
  const [junktownVendorAmount, setJunktownVendorAmount] = useState(0)
  const [pickedMerchantId, setPickedMerchantId] = useState("")
  const discountMerchants = [
    { id: "ConnieAbernathy", name: "Connie Abernathy", buyModifier: 0.75, sellModifier: 1.25 },
    { id: "AlexisCombes", name: "Alexis Combes", buyModifier: 0.9, sellModifier: 1.1 },
    { id: "TrashcanCarla", name: "Trashcan Carla", buyModifier: 1, sellModifier: 1.1 }
  ] as const
  const toggleMerchant = (merchantId: string) => setPickedMerchantId(merchantId === pickedMerchantId ? "" : merchantId)

  const charismaBuyingPriceModifiers = [0, 3.35, 3.20, 3.05, 2.90, 2.75, 2.60, 2.45, 2.30, 2.15, 2.00, 1.85, 1.70, 1.55, 1.40, 1.25, 1.20] as const
  const charismaSellingPriceModifiers = [0, 0.2985, 0.3125, 0.3279, 0.3448, 0.3636, 0.3846, 0.4082, 0.4348, 0.4651, 0.5000, 0.5405, 0.5882, 0.6452, 0.7143, 0.8000] as const

  const getChemBarterModifier = () => {
    for (const chem of pickedChems) {
      if (chem.barterModifier) return 0.1
    }
    return 0
  }
  const getChemCharismaLevel = () => {
    if (!pickedChems.length) return 0
    return pickedChems.reduce((prev, chem) => prev + chem.charisma, 0)
  }
  const getCurCharismaLevel = () => baseCharisma + +charismaBobblehead + +youreSPECIALBook + +hasBarberChair + wearingCharisma + (+hasAlcohol * (+hasPartyPerk + 1)) + getChemCharismaLevel()

  const computedBuyingModifier = () => {
    let curModifier = charismaBuyingPriceModifiers[getCurCharismaLevel()] || (charismaBuyingPriceModifiers.at(-1) as number)
    curModifier *= 1 - getChemBarterModifier()
    curModifier *= [1, 0.9, 0.72][capCollector]
    curModifier *= [1, 0.95][+barterBobblehead]
    curModifier *= 1 - junktownVendorAmount * 0.03
    curModifier *= pickedMerchantId ? discountMerchants.find(merchant => merchant.id === pickedMerchantId)!.buyModifier : 1

    return curModifier < 1.2 ? 1.2 : curModifier
  }

  const computedSellingModifier = () => {
    let curModifier = charismaSellingPriceModifiers[getCurCharismaLevel()] || (charismaSellingPriceModifiers.at(-1) as number)
    curModifier *= 1 + getChemBarterModifier()
    curModifier *= [1, 1.1, 1.32][capCollector]
    curModifier *= [1, 1.05][+barterBobblehead]
    curModifier *= pickedMerchantId ? discountMerchants.find(merchant => merchant.id === pickedMerchantId)!.sellModifier : 1

    return curModifier > 0.8 ? 0.8 : curModifier
  }

  const INSTANCE_PRICE = 1000

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 noselect">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
      </svg>
      <h1 className="h1">BARTER CALCULATOR</h1>
      <div className="flex items-center">
        <label className="mr-4">Base Charisma : </label>
        <div>
          <span className="">{baseCharisma}</span>
          <button className="ml-10" onClick={() => baseCharisma < 10 && setBaseCharisma(baseCharisma + 1)}>+1</button>
          <button className="ml-10" onClick={() => baseCharisma > 1 && setBaseCharisma(baseCharisma - 1)}>-1</button>
        </div>
      </div>

      <div className="flex">
        <fieldset>
          <label className="mr-4" htmlFor="charismaBobblehead">Charisma bobblehead :</label>
          <input id="charismaBobblehead" type="checkbox" onChange={() => setCharismaBobblehead(!charismaBobblehead)} />
        </fieldset>
      </div>

      <div className="flex">
        <fieldset>
          <label className="mr-4" htmlFor="youreSPECIALBook">You're SPECIAL Book(pick Charisma) :</label>
          <input id="youreSPECIALBook" type="checkbox" onChange={() => setYoureSPECIALBook(!youreSPECIALBook)} />
        </fieldset>
      </div>

      <div className="flex">
        <fieldset>
          <label className="mr-4" htmlFor="hasBarberChair">Barber chair :</label>
          <input id="hasBarberChair" type="checkbox" onChange={() => setHasBarberChair(!hasBarberChair)} />
        </fieldset>
      </div>

      <div className="flex items-center">
        <label className="mr-4">Wearings : </label>
        <div>
          <span className="">{wearingCharisma}</span>
          <button className="ml-10" onClick={() => setWearingCharisma(wearingCharisma + 1)}>+1</button>
          <button className="ml-10" onClick={() => wearingCharisma > 0 && setWearingCharisma(wearingCharisma - 1)}>-1</button>
        </div>
      </div>

      <div className="flex">
        <label className="mr-4">Alcohol : </label>
        <fieldset className="flex items-center">
          <label htmlFor="booze">charisma booze</label>
          <input className="ml-2 mr-4" id="booze" type="checkbox" checked={hasAlcohol} onChange={() => setHasAlcohol(!hasAlcohol)} />

          <label htmlFor="partyPerk">party perk</label>
          <input className="ml-2 mr-4" id="partyPerk" type="checkbox" disabled={!hasAlcohol} checked={hasPartyPerk} onChange={() => setHasPartyPerk(!hasPartyPerk)} />
        </fieldset>
      </div>

      <div className="flex">
        <label className="mr-4">Chems : </label>
        <div className="flex items-center">
          {
            CHEMS.map(chem => (
              <React.Fragment key={chem.id}>
                <label htmlFor={chem.id}>{chem.name}</label>
                <input id={chem.id} className="ml-2 mr-4" type="checkbox" checked={pickedChems.map(_ => _.id).includes(chem.id)} onChange={() => toggleChem(chem.id)} />
              </React.Fragment>
            ))
          }
        </div >
        {/* <div>Using Smooth Operator will cancel out Grape Mentats, and vice versa, so their effects cannot be stacked.</div> */}
      </div>


      <div className="flex">
        <label className="mr-4">Cap Collector : </label>
        <fieldset className="flex items-center">
          {
            [0, 1, 2].map(idx => (
              <React.Fragment key={idx}>
                <label htmlFor={`capCollector${idx}`}>{idx || "None"}</label>
                <input className="ml-2 mr-4" id={`capCollector${idx}`} type="radio" name="capCollector" value={capCollector} onChange={() => setCapCollector(idx)} defaultChecked={idx == 0} />
              </React.Fragment>
            ))
          }
        </fieldset>
      </div>

      <div className="flex">
        <fieldset>
          <label className="mr-4" htmlFor="barterBobblehead">Barter bobblehead :</label>
          <input id="barterBobblehead" type="checkbox" onChange={() => setBarterBobblehead(!barterBobblehead)} />
        </fieldset>
      </div>

      <div className="flex items-center">
        <label className="mr-4">Junktown Vendor Amount: </label>
        <div>
          <span className="">{junktownVendorAmount}</span>
          <button className="ml-10" onClick={() => junktownVendorAmount < 8 && setJunktownVendorAmount(junktownVendorAmount + 1)}>+1</button>
          <button className="ml-10" onClick={() => junktownVendorAmount > 0 && setJunktownVendorAmount(junktownVendorAmount - 1)}>-1</button>
        </div>
      </div>


      <div className="flex">
        <label className="mr-4">Discount Merchant : </label>
        <fieldset className="flex items-center">
          {
            discountMerchants.map(merchant => (
              <React.Fragment key={merchant.id}>
                <label htmlFor={merchant.id}>{merchant.name}</label>
                <input className="ml-2 mr-4" id={merchant.id} type="checkbox" checked={merchant.id == pickedMerchantId} onChange={() => toggleMerchant(merchant.id)} />
              </React.Fragment>
            ))
          }
        </fieldset>
      </div>

      <div className="flex">
        <label className="mr-4">An item worth {INSTANCE_PRICE} caps : </label>
        <div className="flex gap-4">
          <span>buy cost <b>{(computedBuyingModifier() * INSTANCE_PRICE) >> 0}</b> (lowest : {1.2 * INSTANCE_PRICE})</span>
          <span> | </span>
          <span>sell for <b>{(computedSellingModifier() * INSTANCE_PRICE) >> 0}</b> (highest : {0.8 * INSTANCE_PRICE})</span>
        </div>
      </div>

    </main>
  )
}