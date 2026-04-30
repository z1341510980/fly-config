import { i as i18n } from './localization.js';
import { s as semver } from './semver.js';
import { F as FC, f as API_VERSION_1_46, b as API_VERSION_1_43 } from './common.js';
import { G as GUI, d as MSP, e as MSPCodes, n as have_sensor, p as updateTabList, m as mspHelper, T as TABS } from './js/main.js';
import { $ as $$1 } from './jquery.js';
import { f as fromLonLat, V as View, T as Tile, O as OSM, X as XYZ, M as Map, I as Icon, S as Style, P as Point, F as Feature, a as SourceVector, L as LayerVector } from './ol.js';
import './i18next.js';
import './@babel.js';
import './i18next-xhr-backend.js';
import './gui_log.js';
import './@korzio.js';
import './lru-cache.js';
import './yallist.js';
import './three.js';
import './window_watchers.js';
import './js/jquery.js';
import './jquery-ui.js';
import './jquery-textcomplete.js';
import './jquery-touchswipe.js';
import './select2.js';
import './multiple-select.js';
import './jbox.js';
import './vue.js';
import './@panter.js';
import './vue-runtime-helpers.js';
import './switchery-latest.js';
import './inflection.js';
import './short-unique-id.js';
import './lodash.debounce.js';
import './crypto-es.js';
import './d3-transition.js';
import './d3-dispatch.js';
import './d3-timer.js';
import './d3-interpolate.js';
import './d3-color.js';
import './d3-selection.js';
import './d3-ease.js';
import './d3-zoom.js';
import './rbush.js';
import './quickselect.js';
import './color-space.js';
import './color-rgba.js';
import './color-parse.js';
import './color-name.js';

const DEFAULT_ZOOM = 17,
    DEFAULT_LON = 0,
    DEFAULT_LAT = 0,
    ICON_IMAGE_GPS = "/images/icons/cf_icon_position.png",
    ICON_IMAGE_MAG = "/images/icons/cf_icon_position_mag.png",
    ICON_IMAGE_NOFIX = "/images/icons/cf_icon_position_nofix.png";

function initMap() {
    const lonLat = fromLonLat([DEFAULT_LON, DEFAULT_LAT]);

    const mapView = new View({
        center: lonLat,
        zoom: DEFAULT_ZOOM,
    });

    const osmLayer = new Tile({
        source: new OSM(),
    });

    const googleSatLayer = new Tile({
        source: new XYZ({
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        }),
    });

    const googleHybridLayer = new Tile({
        source: new XYZ({
            url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        }),
    });

    const map = new Map({
        target: "map",
        layers: [
            osmLayer,
            googleSatLayer,
            googleHybridLayer,
        ],
        view: mapView,
        controls: [],
    });

    const iconGPS = new Icon({
        anchor: [0.5, 1],
        opacity: 1,
        scale: 0.5,
        src: ICON_IMAGE_GPS,
    });

    const iconMag = new Icon({
        anchor: [0.5, 1],
        opacity: 1,
        scale: 0.5,
        src: ICON_IMAGE_MAG,
    });

    const iconNoFix = new Icon({
        anchor: [0.5, 1],
        opacity: 1,
        scale: 0.5,
        src: ICON_IMAGE_NOFIX,
    });

    const iconStyleGPS = new Style({
        image: iconGPS,
    });

    const iconStyleMag = new Style({
        image: iconMag,
    });

    const iconStyleNoFix = new Style({
        image: iconNoFix,
    });

    const iconGeometry = new Point(lonLat);

    const iconFeature = new Feature({
        geometry: iconGeometry,
    });

    iconFeature.setStyle(iconStyleGPS);

    const vectorSource = new SourceVector({
        features: [iconFeature],
    });

    const currentPositionLayer = new LayerVector({
        source: vectorSource,
    });

    map.addLayer(currentPositionLayer);

    // Start with Satellite layer
    osmLayer.setVisible(false);
    googleHybridLayer.setVisible(false);

    $('#Hybrid').on('click', function () {
        if (!googleHybridLayer.isVisible()) {
            osmLayer.setVisible(false);
            googleSatLayer.setVisible(false);
            googleHybridLayer.setVisible(true);
        }
    });

    $('#Satellite').on('click', function () {
        if (!googleSatLayer.isVisible()) {
            osmLayer.setVisible(false);
            googleSatLayer.setVisible(true);
            googleHybridLayer.setVisible(false);
        }
    });

    $('#Street').on('click', function () {
        if (!osmLayer.isVisible()) {
            osmLayer.setVisible(true);
            googleSatLayer.setVisible(false);
            googleHybridLayer.setVisible(false);
        }
    });

    return {
        mapView,
        iconStyleMag,
        iconStyleGPS,
        iconStyleNoFix,
        iconFeature,
        iconGeometry,
    };
}

const gps = {};

gps.initialize = async function (callback) {

    GUI.active_tab = 'gps';

    await MSP.promise(MSPCodes.MSP_FEATURE_CONFIG);

    // mag support added in 1.46
    const hasMag = have_sensor(FC.CONFIG.activeSensors, 'mag') && semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46);

    if (hasMag) {
        await MSP.promise(MSPCodes.MSP_COMPASS_CONFIG);
    }

    await MSP.promise(MSPCodes.MSP_GPS_CONFIG);

    load_html();

    function load_html() {
        $$1('#content').load("./tabs/gps.html", process_html);
    }

    function set_online(){
        $$1('#connect').hide();
        $$1('#waiting').show();
        $$1('#loadmap').hide();
    }

    function set_offline(){
        $$1('#connect').show();
        $$1('#waiting').hide();
        $$1('#loadmap').hide();
    }

    function process_html() {
        // translate to user-selected languageconsole.log('Online');
        i18n.localizePage();

        function get_raw_gps_data() {
            MSP.send_message(MSPCodes.MSP_RAW_GPS, false, false, get_comp_gps_data);
        }

        function get_comp_gps_data() {
            MSP.send_message(MSPCodes.MSP_COMP_GPS, false, false, get_gpsvinfo_data);
        }

        function get_gpsvinfo_data() {
            MSP.send_message(MSPCodes.MSP_GPS_SV_INFO, false, false, get_attitude_data);
        }

        function get_attitude_data() {
            MSP.send_message(MSPCodes.MSP_ATTITUDE, false, false, load_compass_config);
        }

        function load_compass_config() {
            if (hasMag) {
                MSP.send_message(MSPCodes.MSP_COMPASS_CONFIG, false, false, get_imu_data);
            } else {
                get_imu_data();
            }
        }

        function get_imu_data() {
            MSP.send_message(MSPCodes.MSP_RAW_IMU, false, false, update_ui);
        }

        // GPS Configuration
        const features_e = $$1('.tab-gps .features');

        FC.FEATURE_CONFIG.features.generateElements(features_e);

        const checkUpdateGpsControls = () => $$1('.gpsSettings').toggle(FC.FEATURE_CONFIG.features.isEnabled('GPS'));

        $$1('input.feature', features_e).on('change', function () {
            const element = $$1(this);

            FC.FEATURE_CONFIG.features.updateData(element);
            updateTabList(FC.FEATURE_CONFIG.features);

            if (element.attr('name') === 'GPS') {
                checkUpdateGpsControls();
            }
        });

        checkUpdateGpsControls();

        // generate GPS
        const gpsProtocols = [
            'NMEA',
            'UBLOX',
            'MSP',
        ];

        const gpsBaudRates = [
            '115200',
            '57600',
            '38400',
            '19200',
            '9600',
        ];

        const gpsSbas = [
            i18n.getMessage('gpsSbasAutoDetect'),
            i18n.getMessage('gpsSbasEuropeanEGNOS'),
            i18n.getMessage('gpsSbasNorthAmericanWAAS'),
            i18n.getMessage('gpsSbasJapaneseMSAS'),
            i18n.getMessage('gpsSbasIndianGAGAN'),
        ];

        if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
            gpsSbas.push(i18n.getMessage('gpsSbasNone'));
        }

        const gpsProtocolElement = $$1('select.gps_protocol');
        const gpsAutoBaudElement = $$1('input[name="gps_auto_baud"]');
        const gpsAutoBaudGroup = $$1('.gps_auto_baud');
        const gpsAutoConfigElement = $$1('input[name="gps_auto_config"]');
        const gpsAutoConfigGroup = $$1('.gps_auto_config');
        const gpsUbloxGalileoElement = $$1('input[name="gps_ublox_galileo"]');
        const gpsUbloxGalileoGroup = $$1('.gps_ublox_galileo');
        const gpsUbloxSbasElement = $$1('select.gps_ubx_sbas');
        const gpsUbloxSbasGroup = $$1('.gps_ubx_sbas');
        const gpsHomeOnceElement = $$1('input[name="gps_home_once"]');
        const gpsBaudrateElement = $$1('select.gps_baudrate');

        for (let protocolIndex = 0; protocolIndex < gpsProtocols.length; protocolIndex++) {
            gpsProtocolElement.append(`<option value="${protocolIndex}">${gpsProtocols[protocolIndex]}</option>`);
        }

        gpsProtocolElement.change(function () {
            FC.GPS_CONFIG.provider = parseInt($$1(this).val());

            // Call this to enable or disable auto config elements depending on the protocol
            gpsAutoConfigElement.change();

        }).val(FC.GPS_CONFIG.provider).change();

        // auto_baud is no longer used in API 1.46
        if (semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
            gpsAutoBaudElement.prop('checked', FC.GPS_CONFIG.auto_baud === 1);
        }

        gpsAutoConfigElement.on('change', function () {
            const checked = $$1(this).is(":checked");

            const ubloxSelected = FC.GPS_CONFIG.provider === gpsProtocols.indexOf('UBLOX');
            const mspSelected = FC.GPS_CONFIG.provider === gpsProtocols.indexOf('MSP');

            const enableGalileoVisible = checked && ubloxSelected && semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43);
            gpsUbloxGalileoGroup.toggle(enableGalileoVisible);

            const enableSbasVisible = checked && ubloxSelected;
            gpsUbloxSbasGroup.toggle(enableSbasVisible);

            gpsAutoBaudGroup.toggle((ubloxSelected || mspSelected) && semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_46));
            gpsAutoConfigGroup.toggle(ubloxSelected || mspSelected);

        }).prop('checked', FC.GPS_CONFIG.auto_config === 1).trigger('change');

        gpsUbloxGalileoElement.change(function() {
            FC.GPS_CONFIG.ublox_use_galileo = $$1(this).is(':checked') ? 1 : 0;
        }).prop('checked', FC.GPS_CONFIG.ublox_use_galileo > 0).change();

        for (let sbasIndex = 0; sbasIndex < gpsSbas.length; sbasIndex++) {
            gpsUbloxSbasElement.append(`<option value="${sbasIndex}">${gpsSbas[sbasIndex]}</option>`);
        }

        gpsUbloxSbasElement.change(function () {
            FC.GPS_CONFIG.ublox_sbas = parseInt($$1(this).val());
        }).val(FC.GPS_CONFIG.ublox_sbas);

        $$1('.gps_home_once').toggle(semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43));
        gpsHomeOnceElement.change(function() {
            FC.GPS_CONFIG.home_point_once = $$1(this).is(':checked') ? 1 : 0;
        }).prop('checked', FC.GPS_CONFIG.home_point_once > 0).change();

        for (const baudRate of gpsBaudRates) {
            gpsBaudrateElement.append(`<option value="${baudRate}">${baudRate}</option>`);
        }

        gpsBaudrateElement.prop("disabled", true);
        gpsBaudrateElement.parent().hide();

        // fill magnetometer
        if (hasMag) {
            $$1('input[name="mag_declination"]').val(FC.COMPASS_CONFIG.mag_declination.toFixed(1));
        } else {
            $$1('div.mag_declination').hide();
        }

        if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
            const positionalDop = FC.GPS_DATA.positionalDop / 100;
            $$1('.GPS_info td.positionalDop').text(`${positionalDop.toFixed(2)}`);
        } else {
            $$1('.GPS_info td.positionalDop').parent().hide();
        }

        const {
            mapView,
            iconStyleMag,
            iconStyleGPS,
            iconStyleNoFix,
            iconFeature,
            iconGeometry,
        } = initMap();

        // End GPS Configuration

        const gnssArray = ['GPS', 'SBAS', 'Galileo', 'BeiDou', 'IMES', 'QZSS', 'Glonass'];
        const qualityArray = ['gnssQualityNoSignal', 'gnssQualitySearching', 'gnssQualityAcquired', 'gnssQualityUnusable', 'gnssQualityLocked', 'gnssQualityFullyLocked', 'gnssQualityFullyLocked', 'gnssQualityFullyLocked'];
        const usedArray = ['gnssUsedUnused', 'gnssUsedUsed'];

        // GPS Signal Strengths
        function updateSignalStrengths() {
            const eSsTable = $$1('div.GPS_signal_strength table');
            const hasGPS = have_sensor(FC.CONFIG.activeSensors, 'gps');

            $$1('.signal_strength').toggle(!hasGPS);
            eSsTable.html('');

            if (!hasGPS) {
                return;
            }

            eSsTable.append(`
                <tr class="titles">
                    <td style="text-align: left;  width: 12%;" i18n="gpsSignalGnssId">${i18n.getMessage('gpsSignalGnssId')}</td>
                    <td style="text-align: center;width: 10%;" i18n="gpsSignalSatId">${i18n.getMessage('gpsSignalSatId')}</td>
                    <td style="text-align: center;width: 25%;" i18n="gpsSignalStr">${i18n.getMessage('gpsSignalStr')}</td>
                    <td style="text-align: left;  width: 17%;" i18n="gpsSignalStatus">${i18n.getMessage('gpsSignalStatus')}</td>
                    <td style="text-align: left;  width: 33%;" i18n="gpsSignalQuality">${i18n.getMessage('gpsSignalQuality')}</td>
                </tr>
            `);

            if (FC.GPS_DATA.chn.length > 16) {
                // M8N/M9N on newer firmware

                const maxUIChannels = 32; //the list in html can only show 32 channels but future firmware could send more
                let channels = Math.min(maxUIChannels, FC.GPS_DATA.chn.length) || 32;

                for (let i = 0; i < channels; i++) {
                    let rowContent = '';
                    if (FC.GPS_DATA.chn[i] <= 6) {
                        rowContent += `<td>${gnssArray[FC.GPS_DATA.chn[i]]}</td>`;
                    } else {
                        rowContent += '<td>-</td>';
                    }

                    if (FC.GPS_DATA.chn[i] >= 7) {
                        rowContent += '<td>-</td>';
                        rowContent += `<td><meter value="${0}" max="55"></meter></td>`;
                        rowContent += `<td> </td>`;
                    } else {
                        rowContent += `<td>${FC.GPS_DATA.svid[i]}</td>`;
                        rowContent += `<td><meter value="${FC.GPS_DATA.cno[i]}" max="55"></meter></td>`;

                        let quality = i18n.getMessage(qualityArray[FC.GPS_DATA.quality[i] & 0x7]);
                        let used = i18n.getMessage(usedArray[(FC.GPS_DATA.quality[i] & 0x8) >> 3]);
                        let usedColor = '';

                        // Add color to the text
                        // 2nd column: no signal = red, unusable = red, searching = red, locked = yellow and fully locked = green
                        if (quality.startsWith(i18n.getMessage('gnssQualityFullyLocked'))) {
                            usedColor = 'locked';
                            quality = `<span class="colorToggle ready">${quality}</span>`;
                        } else if (quality.startsWith(i18n.getMessage('gnssQualityLocked'))) {
                            usedColor = 'notReady';
                            quality = `<span class="colorToggle locked">${quality}</span>`;
                        } else {
                            quality = `<span class="colorToggle">${quality}</span>`;
                        }

                        // 1st column: unused = red, used = green
                        if (used.startsWith(i18n.getMessage('gnssUsedUsed'))) {
                            used = `<span class="colorToggle ready">${used}</span>`;
                        } else {
                            used = `<span class="colorToggle ${usedColor}">${used}</span>`;
                        }

                        rowContent += `<td style="text-align: left;  width: 17%;">${used}</td>
                                       <td style="text-align: left;  width: 33%;">${quality}</td>`;
                    }
                    eSsTable.append(`<tr>${rowContent}</tr>`);
                }
            } else {
                // Legacy code path: old BF firmware or old ublox module
                for (let i = 0; i < FC.GPS_DATA.chn.length; i++) {
                    eSsTable.append(`
                        <tr>
                            <td>-</td>
                            <td>${FC.GPS_DATA.svid[i]}</td>
                            <td><meter value="${FC.GPS_DATA.cno[i]}" max="55"></meter></td>
                            <td>${FC.GPS_DATA.quality[i]}</td>
                        </tr>
                    `);
                }

                // Cleanup the rest of the table
                for (let i = FC.GPS_DATA.chn.length; i < 32; i++) {
                    eSsTable.append(`
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td><meter value="0" max="55"></meter></td>
                            <td> </td>
                        </tr>
                    `);
                }
            }
        }

        function update_ui() {
            const lat = FC.GPS_DATA.lat / 10000000;
            const lon = FC.GPS_DATA.lon / 10000000;
            const url = `https://maps.google.com/?q=${lat},${lon}`;
            const imuHeadingDegrees = FC.SENSOR_DATA.kinematics[2];
            // Convert to radians and add 180 degrees to make icon point in the right direction
            const imuHeadingRadians = (imuHeadingDegrees + 180) * Math.PI / 180;
            // These are not used, but could be used to show the heading from the magnetometer
            // const magHeadingDegrees = hasMag ? Math.atan2(FC.SENSOR_DATA.magnetometer[1], FC.SENSOR_DATA.magnetometer[0]) : undefined;
            // const magHeadingRadians = magHeadingDegrees === undefined ? 0 : magHeadingDegrees * Math.PI / 180;
            const gpsHeading = FC.GPS_DATA.ground_course / 10;
            let alt = FC.GPS_DATA.alt;

            $$1('.GPS_info span.colorToggle').text(FC.GPS_DATA.fix ? i18n.getMessage('gpsFixTrue') : i18n.getMessage('gpsFixFalse'));
            $$1('.GPS_info span.colorToggle').toggleClass('ready', FC.GPS_DATA.fix != 0);

            const gpsUnitText = i18n.getMessage('gpsPositionUnit');
            $$1('.GPS_info td.alt').text(`${alt} m`);
            $$1('.GPS_info td.latLon a').prop('href', url).text(`${lat.toFixed(6)} / ${lon.toFixed(6)} ${gpsUnitText}`);
            $$1('.GPS_info td.heading').text(`${imuHeadingDegrees.toFixed(0)} / ${gpsHeading.toFixed(0)} ${gpsUnitText}`);
            $$1('.GPS_info td.speed').text(`${FC.GPS_DATA.speed} cm/s`);
            $$1('.GPS_info td.sats').text(FC.GPS_DATA.numSat);
            $$1('.GPS_info td.distToHome').text(`${FC.GPS_DATA.distanceToHome} m`);

            updateSignalStrengths();

            let gpsFoundPosition = false;

            if (navigator.onLine) {
                $$1('#connect').hide();

                gpsFoundPosition = !!(lon && lat);

                if (gpsFoundPosition) {
                    (hasMag ? iconStyleMag : iconStyleGPS)
                        .getImage()
                        .setRotation(imuHeadingRadians);
                    iconFeature.setStyle(hasMag ? iconStyleMag : iconStyleGPS);
                    const center = fromLonLat([lon, lat]);
                    mapView.setCenter(center);
                    iconGeometry.setCoordinates(center);
                } else {
                    iconFeature.setStyle(iconStyleNoFix);
                }
            } else {
                set_offline();
            }

            $$1('#loadmap').toggle(gpsFoundPosition);
            $$1('#waiting').toggle(!gpsFoundPosition);
        }

        // enable data pulling
        GUI.interval_add('gps_pull', function gps_update() {
            get_raw_gps_data();
        }, 75, true);

        //check for internet connection on load
        if (navigator.onLine) {
            console.log('Online');
            set_online();
        } else {
            console.log('Offline');
            set_offline();
        }

        $$1("#check").on('click',function(){
            if (navigator.onLine) {
                console.log('Online');
                set_online();
            } else {
                console.log('Offline');
                set_offline();
            }
        });

        $$1('#zoom_in').click(function() {
            console.log('zoom in');
            mapView.setZoom(mapView.getZoom() + 1);
        });

        $$1('#zoom_out').click(function() {
            console.log('zoom out');
            mapView.setZoom(mapView.getZoom() - 1);
        });

        $$1('a.save').on('click', async function() {
            // fill some data
            FC.GPS_CONFIG.auto_baud = $$1('input[name="gps_auto_baud"]').is(':checked') ? 1 : 0;
            FC.GPS_CONFIG.auto_config = $$1('input[name="gps_auto_config"]').is(':checked') ? 1 : 0;
            FC.COMPASS_CONFIG.mag_declination = $$1('input[name="mag_declination"]').val();

            await MSP.promise(MSPCodes.MSP_SET_FEATURE_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_FEATURE_CONFIG));
            if (hasMag) {
                await MSP.promise(MSPCodes.MSP_SET_COMPASS_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_COMPASS_CONFIG));
            }
            await MSP.promise(MSPCodes.MSP_SET_GPS_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_GPS_CONFIG));

            mspHelper.writeConfiguration(true);
        });

        GUI.content_ready(callback);
    }
};

gps.cleanup = function (callback) {
    if (callback) callback();
};

TABS.gps = gps;

export { gps };
//# sourceMappingURL=gps.js.map
