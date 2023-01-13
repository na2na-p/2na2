import autobind from 'autobind-decorator';
import {parse} from 'twemoji-parser';
const delay = require('timeout-as-promise');

import {Note} from '@/misskey/note';
import Module from '@/module';
import Stream from '@/stream';
import includes from '@/utils/includes';

export default class extends Module {
	public readonly name = 'emoji-react';

	private htl: ReturnType<Stream['useSharedConnection']>;

	@autobind
	public install() {
		this.htl = this.ai.connection.useSharedConnection('homeTimeline');
		this.htl.on('note', this.onNote);

		return {};
	}

	@autobind
	private async onNote(note: Note) {
		if (note.reply != null) return;
		if (note.text == null) return;
		if (note.text.includes('@')) return; // (自分または他人問わず)メンションっぽかったらreject

		const react = async (reaction: string, immediate = false) => {
			if (!immediate) {
				await delay(2500);
			}
			this.ai.api('notes/reactions/create', {
				noteId: note.id,
				reaction: reaction,
			});
		};

		// /う[〜|ー]*んこ/g]にマッチしたときの処理
		if (note.text.match(/う[〜|ー]*んこ/g) || includes(note.text, ['unko'])) {
			return await react(':anataima_unkotte_iimashitane:');
		}

		if (note.text.match(/う[〜|ー]*んち/g)) {
			return await react(':erait:');
		}

		if (note.text.match('static')) {
			return await react(':static_polarbear:');
		}

		if (includes(note.text, ['いい']) && (includes(note.text, ['?']) || includes(note.text, ['？']))) {
			// 50%の確率で":dame:"または":yattare:"を返す
			if (Math.random() < 0.5) {
				return react(':dame:');
			} else {
				return react(':yattare:');
			}
		}

		if (includes(note.text, ['どこ'])) {
			return await react(':t_ofuton:');
		}

		const customEmojis = note.text.match(/:([^\n:]+?):/g);
		if (customEmojis) {
			// カスタム絵文字が複数種類ある場合はキャンセル
			if (!customEmojis.every((val, i, arr) => val === arr[0])) return;

			this.log(`Custom emoji detected - ${customEmojis[0]}`);

			return react(customEmojis[0]);
		}

		const emojis = parse(note.text).map((x) => x.text);
		if (emojis.length > 0) {
			// 絵文字が複数種類ある場合はキャンセル
			if (!emojis.every((val, i, arr) => val === arr[0])) return;

			this.log(`Emoji detected - ${emojis[0]}`);

			const reaction = emojis[0];

			switch (reaction) {
			case '✊': return react('🖐', true);
			case '✌': return react('✊', true);
			case '🖐': case '✋': return react('✌', true);
			}

			return react(reaction);
		}

		if (includes(note.text, ['ぴざ'])) return react('🍕');
		if (includes(note.text, ['ぷりん'])) return react('🍮');
		if (includes(note.text, ['寿司', 'sushi']) || note.text === 'すし') return react('🍣');

		if (includes(note.text, ['ずなず']) || includes(note.text, ['ずにゃず'])) return react('🙌');
		if (includes(note.text, ['なず']) || includes(note.text, ['にゃず'])) {
			if (this.ai.isMaster(note.userId)) {
				return react(':google_hart:');
			}
			return react(':oltu:');
		};

		const gameReact = [
			':ysvi:',
			':ysf:',
			':yso:',
		];
		if (includes(note.text, ['おゲームするかしら'])) {
			// gameReactの中からランダムに選択
			return react(gameReact[Math.floor(Math.random() * gameReact.length)]);
		}
	}
}
