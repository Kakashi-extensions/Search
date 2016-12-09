/*
 This file has been developed by Tristan Jones.
 This software may be used and distributed
 according to the terms of the GNU General Public License version 2.

 This program is distributed in the hope that it will be useful, but WITHOUT
 ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 details.

 Copyright Albert Palacios
*/

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Shell = imports.gi.Shell;
const St = imports.gi.St;
const Util = imports.misc.util;
const Clutter = imports.gi.Clutter;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Panel = imports.ui.panel;
const Tweener = imports.ui.tweener;
const GnomeSession = imports.misc.gnomeSession;

const guuid = 'Search'
const Gettext = imports.gettext.domain(guuid);
const _ = Gettext.gettext;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;


let settingsJSON,settings,settingsID;


const extensionObject = new Lang.Class({
    Name: guuid+"."+guuid,
    Extends: PanelMenu.Button,

    _init: function() {




		let icon = new St.Icon({ icon_name: 'apple-icon',
					 style_class: 'apple-icon' });
		let label = new St.Label({ text: "" });
    this.parent(0.0, label.text);
		this.actor.add_child(icon);

    let path = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DESKTOP);
    this.file = Gio.File.new_for_path(path);

},

_onEvent: function(actor, event) {
    this.parent(actor, event);

    if (event.type() == Clutter.EventType.TOUCH_END ||
        event.type() == Clutter.EventType.BUTTON_RELEASE) {
        try {
            //let context = global.create_app_launch_context(event.get_time(), -1);
          //  Gio.AppInfo.launch_default_for_uri(this.file.get_uri(), context);
          let action = settings.software;

          let def = Shell.AppSystem.get_default();
          let app = def.lookup_app(action);
          app.activate();



        } catch(e) {
            Main.notifyError(_("Failed to launch desktop folder."), e.message);
        }
    }

    return Clutter.EVENT_PROPAGATE;
},

destroy: function() {
    this.parent();
},





});

function onSettingsChanged() {

	settingsJSON = Convenience.getSettings();
	settings = JSON.parse(settingsJSON.get_string("settings-json"));

	extension.destroy();
	extension = new extensionObject();
	Main.panel.addToStatusArea(guuid, extension, settings.position, settings.area);
}

function init(metadata) {
	Convenience.initTranslations(guuid);
	settingsJSON = Convenience.getSettings();
}

function enable() {

	settings = JSON.parse(settingsJSON.get_string("settings-json"));
	settingsID = settingsJSON.connect("changed::settings-json", Lang.bind(this,onSettingsChanged));

	extension = new extensionObject();
	Main.panel.addToStatusArea(guuid, extension, settings.position, settings.area);
}

function disable() {
	settingsJSON.disconnect(settingsID);
	extension.destroy();
}
