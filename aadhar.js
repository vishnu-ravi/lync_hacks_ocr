var Handler = {};
Handler.analyzeText = function(res)
{
    var text = res[0].fullTextAnnotation.text;
    var response = res;
    var _this = this;
    var data = {
    };
    const levenshtein = require('fast-levenshtein');

    var states = {
    "Andaman and Nicobar Islands" : "AN",
    "Andaman": "AN",
    "Nicobar": "AN",
    "Islands": "AN",
    "Andhra Pradesh": "AP",
    "Andhra": "AP",
    "Arunachal Pradesh": "AR",
    "Arunachal": "AR",
    "Assam": "AS",
    "Bihar": "BR",
    "Chandigarh": "CH",
    "Chhattisgarh": "CG",
    "Dadra and Nagar Haveli": "DN",
    "Dadra": "DN",
    "Haveli": "DN",
    "Daman and Diu": "DD",
    "Daman": "DD",
    "Diu": "DD",
    "Delhi": "DL",
    "Goa": "GA",
    "Gujarat": "GJ",
    "Haryana": "HR",
    "Himachal Pradesh": "HP",
    "Himachal": "HP",
    "Jammu and Kashmir": "JK",
    "Jammu": "JK",
    "Kashmir": "JK",
    "Jharkhand": "JS",
    "Karnataka": "KA",
    "Kerala": "KL",
    "Lakshadweep": "LD",
    "Madhya Pradesh": "MP",
    "Madhya": "MP",
    "Maharashtra": "MH",
    "Manipur": "MN",
    "Meghalaya": "ML",
    "Mizoram": "MZ",
    "Nagaland": "NL",
    "Orissa": "OR",
    "Pondicherry": "PY",
    "Puducherry": "PY",
    "Punjab": "PB",
    "Rajasthan": "RJ",
    "Sikkim": "SK",
    "Tamil Nadu": "TN",
    "Tamil": "TN",
    "Nadu": "TN",
    "Telangana": "TS",
    "Tripura": "TR",
    "Uttaranchal": "UK",
    "Uttarakhand": "UK",
    "Uttar Pradesh": "UP",
    "Uttar": "UP",
    "West Bengal": "WB",
    "West": "WB",
    "Bengal": "WB"
};

    try {
        //Check for femal first
        var pattern = /female/i;
        var match = pattern.exec(text);
        if(match != null && match[0].toLowerCase() == 'female') {
            data['sex'] = 'Female';
        }
        //Check for Male gender
        pattern = /male/i;
        match = pattern.exec(text);
        if(match != null && match[0].toLowerCase() == 'male') {
            data['sex'] = 'Male';
        }
        //Check for DOB
        pattern = /DOB:\s*(\S+)/i;
        match = pattern.exec(text);
        if(match != null && typeof match[1] != 'undefined' && this.validateDOB(match[1])) {
            data['dob'] = match[1];
        }
        pattern = /DOB\s*(\S+)/i;
        match = pattern.exec(text);
        if(typeof data['dob'] == 'undefined' && match != null && typeof match[1] != 'undefined' && this.validateDOB(match[1])) {
            data['dob'] = match[1];
        }
        pattern = /DOB.\s*(\S+)/i;
        match = pattern.exec(text);
        if(typeof data['dob'] == 'undefined' && match != null && typeof match[1] != 'undefined' && this.validateDOB(match[1])) {
            data['dob'] = match[1];
        }
        pattern = /father\s*(.+?),/i;
        match = pattern.exec(text);
        if(match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
        }

        pattern = /father\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
        }

        pattern = /SIO\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            var str = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(str.length > 2) {
                pattern = /S\/O(.*)/i;
                var sub_match = pattern.exec(str);

                if(sub_match != null && typeof sub_match[1] != 'undefined') {
                    data['fathersname'] = sub_match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
                }
                else {
                    data['fathersname'] = str
                }


                if(typeof data['sex'] == 'undefined') {
                    data['sex'] = 'Male';
                }
            }
        }

        pattern = /SIO\s*(.+?)\n/i;
        match = pattern.exec(text);

        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            var str = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            if(str.length > 2) {
                pattern = /S\/O(.*)/i;
                var sub_match = pattern.exec(str);

                if(sub_match != null && typeof sub_match[1] != 'undefined') {
                    data['fathersname'] = sub_match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
                }
                else {
                    data['fathersname'] = str;
                }


                if(typeof data['sex'] == 'undefined') {
                    data['sex'] = 'Male';
                }
            }
        }

        pattern = /S\/O\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(typeof data['sex'] == 'undefined') {
                data['sex'] = 'Male';
            }
        }
        pattern = /S\/O\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(typeof data['sex'] == 'undefined') {
                data['sex'] = 'Male';
            }
        }
        pattern = /S\/O:\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(typeof data['sex'] == 'undefined') {
                data['sex'] = 'Male';
            }
        }
        pattern = /S\/O :\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(typeof data['sex'] == 'undefined') {
                data['sex'] = 'Male';
            }
        }
        pattern = /S\/O:\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(typeof data['sex'] == 'undefined') {
                data['sex'] = 'Male';
            }
        }
        pattern = /S\/O :\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(typeof data['sex'] == 'undefined') {
                data['sex'] = 'Male';
            }
        }
        pattern = /S\/O\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(typeof data['sex'] == 'undefined') {
                data['sex'] = 'Male';
            }
        }

        pattern = /DIO\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            var str = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(str.length > 2) {
                pattern = /D\/O(.*)/i;
                var sub_match = pattern.exec(str);

                if(sub_match != null && typeof sub_match[1] != 'undefined') {
                    data['fathersname'] = sub_match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
                }
                else {
                    data['fathersname'] = str;
                }


                if(typeof data['sex'] == 'undefined') {
                    data['sex'] = 'Female';
                }
            }
        }

        pattern = /DIO\s*(.+?)\n/i;
        match = pattern.exec(text);

        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            var str = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(str.length > 2) {
                pattern = /D\/O(.*)/i;
                var sub_match = pattern.exec(str);

                if(sub_match != null && typeof sub_match[1] != 'undefined') {
                    data['fathersname'] = sub_match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
                }
                else {
                    data['fathersname'] = str;
                }


                if(typeof data['sex'] == 'undefined') {
                    data['sex'] = 'Female';
                }
            }
        }

        pattern = /D\/O\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(typeof data['sex'] == 'undefined') {
                data['sex'] = 'Female';
            }
        }
        pattern = /D\/O:\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            data['sex'] = 'Female';
        }
        pattern = /D\/O :\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            data['sex'] = 'Female';
        }
        pattern = /D\/O:\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            data['sex'] = 'Female';
        }
        pattern = /D\/O :\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            data['sex'] = 'Female';
        }
        pattern = /D\/O\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            data['sex'] = 'Female';
        }

        pattern = /WIO\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            data['sex'] = 'Female';
        }

        pattern = /WIO\s*(.+?)\n/i;
        match = pattern.exec(text);

        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            var str = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(str.length > 2) {
                pattern = /D\/O(.*)/i;
                var sub_match = pattern.exec(str);

                if(sub_match != null && typeof sub_match[1] != 'undefined') {
                    data['fathersname'] = sub_match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
                }
                else {
                    data['fathersname'] = str;
                }


                if(typeof data['sex'] == 'undefined') {
                    data['sex'] = 'Female';
                }
            }
        }

        pattern = /W\/O\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            var str = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();

            if(str.length > 2) {
                pattern = /D\/O(.*)/i;
                var sub_match = pattern.exec(str);

                if(sub_match != null && typeof sub_match[1] != 'undefined') {
                    data['fathersname'] = sub_match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
                }
                else {
                    data['fathersname'] = str;
                }


                if(typeof data['sex'] == 'undefined') {
                    data['sex'] = 'Female';
                }
            }
        }
        pattern = /W\/O:\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
        }
        pattern = /W\/O :\s*(.+?),/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            data['sex'] = 'Female';
        }
        pattern = /W\/O:\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            data['sex'] = 'Female';
        }
        pattern = /W\/O :\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            data['sex'] = 'Female';
        }
        pattern = /W\/O\s*(.+?)\n/i;
        match = pattern.exec(text);
        if(typeof data['fathersname'] == 'undefined' && match != null && typeof match[1] != 'undefined') {
            data['fathersname'] = match[1].replace(/\./g, '').replace(/[a-z]*\d+[a-z]*/gi, '').trim();
            data['sex'] = 'Female';
        }

        var splited_string = text.split(/\r?\n/);
        pattern = /\d{4}\s\d{4}\s\d{4}/;
        var for_match;
        for (var i = 0; i < splited_string.length; i++) {
            for_match = pattern.exec(splited_string[i]);
            if(for_match != null && typeof for_match[0] != 'undefined') {
                data['uid'] = for_match[0];
                break;
            }
        }
        if(typeof response[0] != 'undefined' && typeof response[0].faceAnnotations != 'undefined') {
            var image_right_top_corner = response[0].faceAnnotations[0].boundingPoly.vertices[1];
            var distances = [];
            for(var key in response[0].textAnnotations) {
                if(key == 0) continue;
                var vertices = response[0].textAnnotations[key].boundingPoly.vertices[0];
                distances.push({
                    key: key,
                    coords:  _this.findDistance(image_right_top_corner.x, image_right_top_corner.y, vertices.x, vertices.y)
                });
            }
            var temp_dis = {};
            for(var i=0; i < distances.length; i++) {
                temp_dis[i] = distances[i].distance;
            }
            var selected_key = Object.keys(temp_dis).reduce(function(a, b){ return temp_dis[a] < temp_dis[b] ? a : b });
            selected_key = distances[selected_key].key;
            var name_pattern = response[0].textAnnotations[selected_key].description;
            pattern = '\\b'+name_pattern+'\\b\s*(.+?)\n'
            match = text.match(new RegExp(pattern,'g'));
            if(match != null && typeof match[0] != 'undefined') {
                data['name'] = match[0].replace(/\n/g, '');
            }
        }
        var address_string = [];
        for (var i = 0; i < splited_string.length; i++) {
            var regex = new RegExp(data['uid'], 'g');
            for_match = regex.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            regex = new RegExp(data['dob'], 'g');
            for_match = regex.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /DOB/.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /male/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }

            for_match = /www\./i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /[^\u0000-\u007f]/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }

            for_match = /your/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /identi/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /authent/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /enroll/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /info/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /aadhaar/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /help/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /address/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /gov/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /CERTIFI/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /india/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /COM/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /expire/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /VEHICLE/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /TRANSPORT/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /enroll/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /Enrolment|Download|generate|date|valid|nown|Authority|write|year/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /Enrolment/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /Download/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /generate/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /date/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /valid/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /nown/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /authority/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /write/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            for_match = /year/i.exec(splited_string[i]);
            if(for_match != null && for_match[0] != '') {
                continue;
            }
            if(typeof data['name'] != 'undefined') {
                var regex = new RegExp(data['name'], 'g');
                for_match = regex.exec(splited_string[i]);
                if(for_match != null && for_match[0] != '') {
                    continue;
                }
            }
            if(splited_string[i].length <=3) {
                continue;
            }
            if(/^\d+$/.test(splited_string[i]) && ! /^\d{6}$/.test(splited_string[i])) {
                continue;
            }
            address_string.push(splited_string[i]);
        }
        for(var i = 0; i < address_string.length; i++) {
            address_string[i] = address_string[i].replace(/S\/O\s/i, '');
            address_string[i] = address_string[i].replace(/SIO\s/i, '');
            address_string[i] = address_string[i].replace(/father/i, '');
            var regex = new RegExp(data['fathersname'] + ',', 'g');
            address_string[i] = address_string[i].replace(regex, '').trim();
            var regex = new RegExp(data['fathersname'], 'g');
            address_string[i] = address_string[i].replace(regex, '').trim();
        }
        if(typeof data['name'] == 'undefined' && typeof response[0] != 'undefined') {
            var words_coords = [];
            var words = [];
            for(var i =0; i < address_string.length; i++) {
                var tmp_words = address_string[i].split(' ');
                var final_words = [];
                var take_next = false;
                for(var j = 0; j < tmp_words.length; j++) {
                    if(tmp_words[j] == '' || (/^\d+$/.test(tmp_words[j]) && ! /\d{6}$/.test(tmp_words[j]))) continue;
                    if(tmp_words[j].length < 3) {
                        take_next = true;
                        continue;
                    }
                    if((/\d{6}$/.test(tmp_words[j]) || j == 0) || take_next) {
                        final_words.push(tmp_words[j]);
                        take_next = false;
                    }
                }
                words = words.concat(final_words);
            }
            for(var key in response[0].textAnnotations) {
                if(key == 0) continue;
                var str = response[0].textAnnotations[key].description;
                if(words.indexOf(str) != -1 && ! /[^\u0000-\u007f]/.test(str)) {
                    words_coords.push({
                        key: str,
                        coords: response[0].textAnnotations[key].boundingPoly.vertices[0]
                    });
                }
            }
            var target_coords, target_key;
            for(var i = 0; i < words_coords.length; i++) {
                if(/\d{6}$/.test(words_coords[i].key)) {
                    target_coords = words_coords[i].coords;
                    target_key = words_coords[i].key;
                }
            }
            if(typeof target_coords != 'undefined') {
                var distances = [];
                for(var i = 0; i < words_coords.length; i++) {
                    if(words_coords[i].key == target_key) continue;
                    distances.push({
                        key: words_coords[i].key,
                        distance: _this.findDistance(target_coords.x, target_coords.y, words_coords[i].coords.x, words_coords[i].coords.y)
                    });
                }
                if(distances.length) {
                    var temp_dis = {};
                    for(var i=0; i < distances.length; i++) {
                        temp_dis[i] = distances[i].distance;
                    }
                    var selected_key = Object.keys(temp_dis).reduce(function(a, b){ return temp_dis[a] > temp_dis[b] ? a : b });
                    selected_key = distances[selected_key].key;
                    for(var i =0; i < address_string.length; i++) {
                        var regex = new RegExp(selected_key, 'g');
                        if(regex.test(address_string[i])) {
                            data['name'] = address_string[i];
                        }
                    }
                    for(var i = 0; i < address_string.length; i++) {
                        var regex = new RegExp(data['name'], 'g');
                        address_string[i] = address_string[i].replace(regex, '').trim();
                    }
                }
            }
        }
        var address = '';
        var added_address = [];
        for(var i = 0; i < address_string.length; i++) {
            if(added_address.indexOf(address_string[i].trim()) != -1) {
                break;
            }
            if(address_string[i] != '') {
                added_address.push(address_string[i]);
                address += ' ' + address_string[i];
            }
        }
        var words = address.split(' ');
        var states_arr = Object.keys(states);
        var state;
        for(var i = 0; i < states_arr.length; i++) {
            for(var j = 0; j < words.length; j++) {
                if(levenshtein.get(states_arr[i], words[j]) < 2) {
                    state = states_arr[i];
                }
            }
        }

        address = address.replace(/typ 1800 \d{3} \d{4}/, '');
        address = address.replace(/1800 \d{3} \d{4}/, '');
        address = address.replace(/SIO/i, '');
        address = address.replace(/S\/O/i, '');
        address = address.replace(/S\/O:/i, '');

        data['address'] = address;
        if(typeof state != 'undefined') {
            data['state'] = states[state];
        }
        pattern = /\d{6}/;
        match = pattern.exec(address);

        if(match != null && typeof match[0] != 'undefined') {
            data['pincode'] = match[0];
        }

        if(typeof data['fathersname'] != 'undefined') {
            data['fathersname'] = data['fathersname'].replace(':', '').trim();
        }
    }
    catch(e){
        data =  {
            name : '',
            sex : '',
            uid : '',
            address : '',
            dob : '',
            fathersname : '',
            state : '',
            pincode : ''
        };
    }

    if(typeof data['sex'] == 'undefined') {
        data['sex'] = 'Male';
    }

    var ogData =  {
        name : '',
        sex : '',
        uid : '',
        address : '',
        dob : '',
        fathersname : '',
        state : '',
        pincode : ''
    };
    var extend = require('util')._extend
    var o = extend({}, ogData);
    console.log(extend(o,  data));
    return extend(o,  data);
}
Handler.validateDOB = function (dob)
{
    var pattern = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

    return pattern.test(dob);
};

Handler.findDistance = function(x1, y1, x2, y2) {
    var a = x1 - x2
    var b = y1 - y2

    return Math.sqrt( a*a + b*b );
};
module.exports =  Handler;
