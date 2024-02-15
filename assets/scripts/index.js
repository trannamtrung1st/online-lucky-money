const money10kImgPath = "assets/images/money-10k.jpg";
const money20kImgPath = "assets/images/money-20k.jpg";
const money50kImgPath = "assets/images/money-50k.jpg";
const money100kImgPath = "assets/images/money-100k.jpg";
const money200kImgPath = "assets/images/money-200k.jpg";
const money500kImgPath = "assets/images/money-500k.jpg";
const moneyImagesMap = {
    [10]: money10kImgPath,
    [20]: money20kImgPath,
    [50]: money50kImgPath,
    [100]: money100kImgPath,
    [200]: money200kImgPath,
    [500]: money500kImgPath,
};
function initializeLuckyMoneyData() {
    const data = {};
    const params = new URLSearchParams(location.search);
    data.params = params;
    const seed = params.get('s');
    const mapping = params.get('m');
    const mappingObj = JSON.parse(atob(mapping));
    data.mapping = mappingObj;
    let envIdx = -1;
    mappingObj.envelopes = _.orderBy(mappingObj.envelopes, () => {
        envIdx += 1;
        return new Math.seedrandom(seed + envIdx).int32();
    })
    const selectedIdx = parseInt(params.get('i'));
    if (typeof selectedIdx === 'number') {
        data.envelope = mappingObj.envelopes[selectedIdx];
        data.envelopeImg = `assets/images/envelope-${selectedIdx + 1}.jpg`;
    }
    return data;
}

function initializeUI() {
    const data = initializeLuckyMoneyData();
    const envContainer = $('#env-container');
    if (data.envelope) {
        envContainer.append(`<div class="col-md-3 d-flex justify-content-center">
            <div class="envelope">
                <img src="${data.envelopeImg}" class="w-100 h-100" />
            </div>
        </div>`);
        const moneyContainer = $(`<div class="col-md-3 d-flex flex-column justify-content-center"></div>`);
        data.envelope.moneys.forEach(money => {
            moneyContainer.append(`<img src="assets/images/money-${money}k.jpg" class="w-100 h-auto" />`);
        });
        envContainer.append(moneyContainer);
    } else {
        data.mapping.envelopes.forEach((_, idx) => {
            const envElement = $(`<div class="col-md-3 d-flex justify-content-center">
                <div class="envelope">
                    <img src="assets/images/envelope-${idx + 1}.jpg" class="w-100 h-100" />
                </div>
            </div>`);
            envElement.find('.envelope').on('click', () => {
                $('#env-url').show();
                data.params.set('i', idx);
                const url = new URL(location.pathname, location.origin);
                url.search = data.params.toString();
                $('#env-url__link').attr('href', url.toString());
                $('#env-url__number').html(idx + 1);
            });
            envContainer.append(envElement);
        });
    }
}

initializeUI();