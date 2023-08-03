import { locale as localeHu } from '../locale/hu';
import { locale as localeEn } from '../locale/en';

export interface LocaleModel {
    lang: string;
    data: Object;
}

export const locales: LocaleModel[] = [localeEn, localeHu];
