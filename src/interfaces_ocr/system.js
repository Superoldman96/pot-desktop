import { ocrID } from '../windows/Ocr/components/TextArea';
import { invoke } from '@tauri-apps/api';
import { Command } from '@tauri-apps/api/shell';
import { type } from '@tauri-apps/api/os';

export const info = {
    name: 'system',
    supportLanguage: {
        auto: 'chi_sim+eng+chi_tra+jpn+kor+fra+spa+rus+deu+ita+tur+por+vie+ind+tha+msa+ara+hin',
        zh_cn: 'chi_sim',
        zh_tw: 'chi_tra',
        en: 'eng',
        yue: 'chi_sim',
        ja: 'jpn',
        ko: 'kor',
        fr: 'fra',
        es: 'spa',
        ru: 'rus',
        de: 'deu',
        it: 'ita',
        tr: 'tur',
        pt: 'por',
        pt_br: 'por',
        vi: 'vie',
        id: 'ind',
        th: 'tha',
        ms: 'msa',
        ar: 'ara',
        hi: 'hin',
    },
    needs: [],
};

export async function ocr(_, lang, setText, id) {
    const platform = await type();

    if (platform === 'Linux') {
        const { supportLanguage } = info;
        const result = await invoke('system_ocr', { lang: supportLanguage[lang] });
        if (ocrID === id || id === 'translate') {
            setText(result);
        }
    } else if (platform === 'Darwin') {
        const supportLanguage_for_macos = {
            auto: 'auto',
            zh_cn: 'zh-Hans',
            zh_tw: 'zh-Hant',
            en: 'en-US',
            yue: 'zh-Hans',
            ja: 'ja-JP',
            ko: 'ko-KR',
            fr: 'fr-FR',
            es: 'es-ES',
            ru: 'ru-RU',
            de: 'de-DE',
            it: 'it-IT',
            tr: 'tr-TR',
            pt: 'pt-PT',
            pt_br: 'pt-BR',
            vi: 'vi-VN',
            id: 'id-ID',
            th: 'th-TH',
            ms: 'ms-MY',
            ar: 'ar-SA',
            hi: 'hi-IN',
        }
        const img_path = await invoke('system_ocr');
        const command = Command.sidecar('bin/ocr', [img_path, supportLanguage_for_macos[lang]]);
        const output = await command.execute();
        if (!output.code) {
            if (ocrID === id || id === 'translate') {
                setText(output.stdout);
            }
        } else {
            throw output.stderr;
        }
    } else {
        const supportLanguage_for_win = {
            auto: 'auto',
            zh_cn: 'zh-CN',
            zh_tw: 'zh-TW',
            en: 'en-US',
            yue: 'zh-HK',
            ja: 'ja-JP',
            ko: 'ko-KR',
            fr: 'fr-FR',
            es: 'es-ES',
            ru: 'ru-RU',
            de: 'de-DE',
            it: 'it-IT',
            tr: 'tr-TR',
            pt: 'pt-PT',
            pt_br: 'pt-BR',
            vi: 'vi-VN',
            id: 'id-ID',
            th: 'th-TH',
            ms: 'ms-MY',
            ar: 'ar-SA',
            hi: 'hi-IN',
        }
        const result = await invoke('system_ocr', { lang: supportLanguage_for_win[lang] });
        if (ocrID === id || id === 'translate') {
            setText(result);
        }
    }
}