import { CapacitorHttp } from '@capacitor/core';
import { PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import type { Entry, FlightType } from '../features/entries/types';
import { MONTHS } from './date';

type ReversePageSize<PageSize> = PageSize extends [infer w, infer h] ? [h, w] : [];

let entryPDF: Uint8Array | null = null

export async function generatePDF () {
  const pdf = await PDFDocument.create();
  const form = pdf.getForm();
  const page = pdf.addPage(PageSizes.Letter.slice().reverse() as ReversePageSize<typeof PageSizes.Letter>);
  const { width, height } = page.getSize();
  page.drawRectangle({
    x: 36,
    y: 36,
    width: width - 72,
    height: height - 72,
    borderWidth: 0.5,
    color: rgb(1, 1, 1)
  });
  page.drawLine({
    start: { x: 36, y: height - 108 },
    end: { x: width - 36, y: height - 108 },
    thickness: 0.5
  });
  page.drawLine({
    start: { x: 108, y: height - 36 },
    end: { x: 108, y: height - 108 },
    thickness: 0.5
  });

  const logoRes = await CapacitorHttp.get({
    url: '/assets/logo.png',
    responseType: 'arraybuffer'
  });
  const logoBytes = logoRes.data as ArrayBuffer;
  const logoImage = await pdf.embedPng(logoBytes)
  page.drawImage(logoImage, {
    x: 40,
    y: height - 104,
    width: 64,
    height: 64
  });
  page.drawText('AIRCRAFT ENTRY LOG', {
    x: 140,
    y: height - 78,
    size: 16
  });
  page.drawLine({
    start: { x: width - 180, y: height - 36 },
    end: { x: width - 180, y: height - 108 },
    thickness: 0.5
  });
  page.drawText('Entry Type and No', {
    x: width - 168,
    y: height - 56,
    size: 8
  });
  page.drawLine({
    start: { x: 36, y: height - 180 },
    end: { x: width - 36, y: height - 180 },
    thickness: 0.5
  });
  page.drawLine({
    start: { x: 180, y: height - 108 },
    end: { x: 180, y: height - 180 },
    thickness: 0.5
  });
  page.drawText('Aircraft Registration:', {
    x: 48,
    y: height - 128,
    size: 8
  });
  page.drawLine({
    start: { x: 180, y: height - 144 },
    end: { x: width - 180, y: height - 144 },
    thickness: 0.5
  });
  page.drawText('Aircraft Type:', {
    x: 192,
    y: height - 128,
    size: 8
  });
  page.drawText('Nature of Flight:', {
    x: 192,
    y: height - 164,
    size: 8
  });
  const natureTest = form.createCheckBox('entry.nature.test');
  const natureFerry = form.createCheckBox('entry.nature.ferry');
  const natureTraining = form.createCheckBox('entry.nature.training');
  const natureADG = form.createCheckBox('entry.nature.adg');
  natureTest.addToPage(page, {
    x: 260,
    y: height - 165,
    width: 8,
    height: 8
  });
  page.drawText('Test', {
    x: 272,
    y: height - 165,
    size: 10
  });
  natureFerry.addToPage(page, {
    x: 310,
    y: height - 165,
    width: 8,
    height: 8
  });
  page.drawText('Ferry', {
    x: 322,
    y: height - 165,
    size: 10
  });
  natureTraining.addToPage(page, {
    x: 364,
    y: height - 165,
    width: 8,
    height: 8
  });
  page.drawText('Training', {
    x: 376,
    y: height - 165,
    size: 10
  });
  natureADG.addToPage(page, {
    x: 433,
    y: height - 165,
    width: 8,
    height: 8
  });
  page.drawText('ADG/MX Flight', {
    x: 445,
    y: height - 165,
    size: 10
  });
  page.drawLine({
    start: { x: width - 180, y: height - 108 },
    end: { x: width - 180, y: height - 180 },
    thickness: 0.5
  });
  const complianceCb = form.createCheckBox('entry.compliance');
  complianceCb.addToPage(page, {
    x: width - 170,
    y: height - 126,
    width: 8,
    height: 8
  });
  page.drawLine({
    start: { x: 36, y: 144 },
    end: { x: width - 36, y: 144 },
    thickness: 0.5
  });
  page.drawText('Reason:', {
    x: 48,
    y: height - 201,
    size: 8
  });
  page.drawLine({
    start: { x: width - 180, y: height - 180 },
    end: { x: width - 180, y: 144 },
    thickness: 0.5
  });
  page.drawText('AMO No:', {
    x: width - 170,
    y: height - 197,
    size: 8
  });
  page.drawLine({
    start: { x: width - 180, y: height - 227 },
    end: { x: width - 36, y: height - 227 },
    thickness: 0.5
  });
  page.drawText('Date:', {
    x: width - 170,
    y: height - 245,
    size: 8
  });
  page.drawLine({
    start: { x: width - 180, y: height - 280 },
    end: { x: width - 36, y: height - 280 },
    thickness: 0.5
  });
  page.drawText('Time:', {
    x: width - 170,
    y: height - 300,
    size: 8
  });
  page.drawLine({
    start: { x: width - 180, y: height - 330 },
    end: { x: width - 36, y: height - 330 },
    thickness: 0.5
  });
  page.drawLine({
    start: { x: 252, y: 144 },
    end: { x: 252, y: 36 },
    thickness: 0.5
  });
  page.drawText('Left Fuel Tank:', {
    x: 48,
    y: 124,
    size: 8
  });
  page.drawLine({
    start: { x: 36, y: 108 },
    end: { x: 252, y: 108 },
    thickness: 0.5
  });
  page.drawText('Right Fuel Tank:', {
    x: 48,
    y: 88,
    size: 8
  });
  page.drawLine({
    start: { x: 36, y: 72 },
    end: { x: 252, y: 72 },
    thickness: 0.5
  });
  page.drawText('Total Fuel:', {
    x: 48,
    y: 52,
    size: 8
  });
  page.drawLine({
    start: { x: 504, y: 144 },
    end: { x: 504, y: 36 },
    thickness: 0.5
  });
  page.drawText('Next Inspection:', {
    x: 260,
    y: 128,
    size: 8
  });
  page.drawLine({
    start: { x: 252, y: 90 },
    end: { x: 504, y: 90 },
    thickness: 0.5
  });
  page.drawText('Tach Time Due:', {
    x: 260,
    y: 74,
    size: 8
  });
  page.drawLine({
    start: { x: 530, y: 75 },
    end: { x: 729, y: 75 },
    thickness: 0.5
  });
  page.drawText('Aircraft Mechanic', {
    x: 600,
    y: 62,
    size: 8
  });

  return await pdf.save();
}

export async function getPDF (id: string, entry: Entry) {
  if (entryPDF === null) entryPDF = await generatePDF();

  const pdf = await PDFDocument.load(entryPDF);
  const form = pdf.getForm();
  const page = pdf.getPage(0);
  const { width, height } = page.getSize();

  let flightType = '';
  if (entry.flightType === 'preflight') flightType = 'Preflight';
  if (entry.flightType === 'transit') flightType = 'Transit';
  if (entry.flightType === 'postflight') flightType = 'Postflight';

  page.drawText(flightType + ' - ' + id, {
    x: width - 168,
    y: height - 88,
    size: 17
  });

  page.drawText(entry.registration, {
    x: 52,
    y: height - 154,
    size: 16
  });

  page.drawText(entry.type, {
    x: 260,
    y: height - 130,
    size: 12
  });

  if (entry.nature === 'Test') form.getCheckBox('entry.nature.test').check();
  if (entry.nature === 'Ferry') form.getCheckBox('entry.nature.ferry').check();
  if (entry.nature === 'Training') form.getCheckBox('entry.nature.training').check();
  if (entry.nature === 'ADG/MX Flight') form.getCheckBox('entry.nature.adg').check();

  const compliance = getEntryCompliance(entry.flightType);
  page.drawText(compliance, {
    x: width - 156,
    y: height - 120,
    size: 8,
    maxWidth: 116,
    lineHeight: 9
  });

  if (entry.compliance) form.getCheckBox('entry.compliance').check();

  page.drawText(entry.reason, {
    x: 48,
    y: height - 36 - 186,
    color: rgb(0, 0, 0),
    size: 14,
    maxWidth: width - 240,
    lineHeight: 20
  });

  page.drawText(entry.amoNo, {
    x: width - 170,
    y: height - 215,
    size: 16
  });

  const date = new Date(entry.date);
  const month = MONTHS[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  const dateStr = `${month} ${day}, ${year}`;
  page.drawText(dateStr, {
    x: width - 170,
    y: height - 265,
    size: 16
  });

  const time = entry.time.toString();
  const hours = time.substring(0, 2);
  const minutes = time.substring(time.length > 4 ? 3 : 2);
  const timeStr = `${hours}${minutes}`;
  page.drawText(timeStr, {
    x: width - 170,
    y: height - 320,
    size: 16
  });

  page.drawText(entry.leftFuel.toString() + ' gal.', {
    x: 120,
    y: 122,
    size: 14
  });

  page.drawText(entry.rightFuel.toString() + ' gal.', {
    x: 120,
    y: 86,
    size: 14
  });

  page.drawText(entry.totalFuel.toString() + ' gal.', {
    x: 120,
    y: 50,
    size: 14
  });

  page.drawText(entry.nextins, {
    x: 260,
    y: 108,
    size: 14
  });

  page.drawText(entry.tachTime, {
    x: 260,
    y: 54,
    size: 14
  });

  const font = await pdf.embedFont(StandardFonts.Courier);
  const nameWidth = font.widthOfTextAtSize(entry.mechanic, 12);
  page.drawText(entry.mechanic, {
    x: 530 + (99.5 - (nameWidth / 2)),
    y: 80,
    font,
    size: 12
  });

  const match = entry.signature.match(/^data:(\w+\/[-+.\w]+);(base64,)?(.+)$/);
  if (match !== null) {
    const mime = match[1];
    const isBase64 = match[2];
    const data = isBase64 ? atob(match[3]) : match[3];
    const signBytes = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      signBytes[i] = data.charCodeAt(i);
    }
    const signBuffer = signBytes.buffer;
    const signImage = await (mime === 'image/png' ? pdf.embedPng(signBuffer) : pdf.embedJpg(signBuffer));
    const { width: imgWidth, height: imgHeight } = signImage.scale(0.25);
    page.drawImage(signImage, {
      x: 530 + (99.5 - (imgWidth / 2)),
      y: 90,
      width: imgWidth,
      height: imgHeight
    });
  }

  return await pdf.save();
}

export function getEntryCompliance (type: FlightType) {
  if (type === 'preflight') {
    return 'Complied Pre-Flight Maint. Check in accordance with C172R/S Pre-Flight Maint. Check Form No. AICAT-AMO/AM/002 ISSUE 1 JUNE, REV DATE, 3 APRIL, 2021?';
  }

  if (type === 'transit') {
    return 'Complied in accordance with C172R/S Transit Check Form AICAT/AM/014 REV. DATE 0/FEB-2021 ISSUE DATE: FEB 2021?';
  }

  if (type === 'postflight') {
    return 'Complied Post-Flight Maint. Check as per C172R/S Post-Flight Maint. Check Form No. AICAT/AMO/AM/003 Issue. 1 June 2020 Rev. 3 April 2021?';
  }

  return '';
}
