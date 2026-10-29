const serviceName = "Honeymoon Plan";
let isSubscribed = false;
let submitCount = 0;

console.log(typeof serviceName);
console.log(typeof isSubscribed);
console.log(typeof submitCount);

function makeSubscribeMessage(email, subscribed) {
    if (subscribed === true) {
        return email + "님, 신청이 완료되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");

const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();

    if (subscriberEmail === "") {
        subscribeMessage.textContent =
            "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent =
        makeSubscribeMessage(subscriberEmail, isSubscribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agree");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick(event) {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput(event) {
   const maxLength = nicknameInput.maxLength;
   const currentLength = Math.min(nicknameInput.value.length, maxLength);
   
   nicknameCount.textContent = currentLength + " / " + maxLength;
}
nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
   const agreed = agreeCheck.checked;

   startButton.disabled = !agreed;
   agreeMessage.textContent = agreed 
    ? "여행준비를 시작할 수 있습니다." 
    : "동의 후 여행준비를 시작할 수 있습니다.";

    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else{
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels(){
    tabs.forEach(function(tab){
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected","false");
    });
    panels.forEach(function(panel){
        panel.classList.remove("is-active")
        panel.hidden = true;
    })
}

function activateTab(clickedTab){
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.getElementById(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected","true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event){
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function(tab){
    tab.addEventListener("click", handleTabClick);
})

const trainingFlow= document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress_item");
const titleInput = document.querySelector("#presentation-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const qnaInputs = document.querySelectorAll('input[name="qna-count"]')
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna")
const durationValues = ["3","5","10"];

// 09주차 교안 15~16쪽: 하나의 form에서 검증과 제출 상태를 관리합니다.
const planForm = document.querySelector("#plan-form");
const titleField = document.querySelector("#title-field");
const titleHelp = document.querySelector("#title-help");
const titleCount = document.querySelector("#title-count");
const planSubmitMessage = document.querySelector("#plan-submit-message");
const submissionStorageKey = "honeymoon-travel:last-submission:v1";
let currentStep = 0;
let submitState = "idle";
let isSubmitting = false;

const formData = {
    title: "", duration: "5", qna: false, qnaCount: "2"
};

function showStep(index){
    currentStep = index;
    if (index !== 3 && submitState === "success") setSubmitState("idle");
    if (index !== 3) {
        completedPlan = null;
        document.querySelector("#save-plan-message").textContent = "";
    }
    flowSteps.forEach((step, i) => {step.hidden = i !== index; })
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i=== index)
    });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement(){
    agreeCheck.checked = false;
    trainingFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click",() =>{
    if(!agreeCheck.checked)return;
    recordingDialog.showModal();
});

recordingCancel.addEventListener("click", ()=>{
    recordingDialog.close();
    revokeRecordingAgreement();
});
recordingDialog.addEventListener("cancel",revokeRecordingAgreement);
recordingConfirm.addEventListener("click",()=>{
    if(!agreeCheck.checked) return;
    recordingDialog.close();
    agreeMessage.textContent = "여행준비를 시작했습니다.";
    trainingFlow.hidden = false;
    showStep(0);
    trainingFlow.scrollIntoView({behavior: "smooth"});
    titleInput.focus();
})
    
// 교안 14쪽: 검증과 오류 표시를 분리합니다.
function showError(message) {
    titleError.textContent = message;
    titleInput.setAttribute("aria-invalid", "true");
    titleInput.classList.add("has-error");
    titleField.classList.add("is-error");
    titleField.classList.remove("is-valid");
    return false;
}

function clearError() {
    titleError.textContent = "";
    titleInput.removeAttribute("aria-invalid");
    titleInput.classList.remove("has-error");
    titleField.classList.remove("is-error");
}

function validateTitle() {
    const value = titleInput.value.trim();
    if (!value) return showError("여행 제목을 입력해 주세요. 예: 다카마쓰 신혼여행");
    if (value.length < 2) return showError("여행 제목을 앞뒤 공백 없이 2자 이상 입력해 주세요.");
    if (titleInput.value.length > 60) return showError("여행 제목을 60자 이하로 줄여 주세요.");
    clearError();
    formData.title = value;
    return true;
}

// 교안 10쪽: 글자 수는 원래 값, 최소 길이는 trim()한 값으로 검사합니다.
function updateTitleState() {
    const length = titleInput.value.length;
    const ok = titleInput.value.trim().length >= 2 && length <= 60;
    titleCount.textContent = length + " / 60자";
    titleHelp.textContent = ok
        ? "입력 조건을 충족했습니다."
        : "앞뒤 공백을 제외하고 2자 이상, 전체 60자 이하로 입력해 주세요.";
    titleField.classList.toggle("is-valid", ok);
    if (titleInput.getAttribute("aria-invalid") === "true") validateTitle();
}
titleInput.addEventListener("input", updateTitleState);
updateTitleState();

titleNext.addEventListener("click", () => {
    if (!validateTitle()) {
        titleInput.focus();
        return;
    }
    showStep(1);
});

durationRange.addEventListener("input", () =>{
    durationValue.value = durationValues[durationRange.value] + "분";
    document.querySelector("#duration-error").textContent = "";
    durationRange.removeAttribute("aria-invalid");
});

function syncQnaOptions(){
    const open = qnaOption.checked;
    qnaOption.setAttribute("aria-expanded",String(open));
    if (!open) {
        document.querySelector("#qna-error").textContent = "";
        qnaOption.removeAttribute("aria-invalid");
    }
    qnaOptions.hidden = !open;
    qnaOptions.disabled = !open || isSubmitting;
    qnaInputs.forEach((input) => {
        input.disabled = !open || isSubmitting;
    });
}

qnaOption.addEventListener("change", syncQnaOptions);
qnaInputs.forEach((input) => {
    input.addEventListener("change", () => {
        document.querySelector("#qna-error").textContent = "";
        qnaOption.removeAttribute("aria-invalid");
    });
});
syncQnaOptions();
optionPrev.addEventListener("click", () => showStep(0));
function readPlanOptions() {
    const duration = durationValues[durationRange.value];
    const durationError = document.querySelector("#duration-error");
    const qnaError = document.querySelector("#qna-error");
    durationError.textContent = "";
    qnaError.textContent = "";
    durationRange.removeAttribute("aria-invalid");
    qnaOption.removeAttribute("aria-invalid");
    if (!duration) {
        durationError.textContent = "준비 시간을 3분, 5분, 10분 중 다시 선택해 주세요.";
        durationRange.setAttribute("aria-invalid", "true");
        return false;
    }
    const count = document.querySelector('input[name="qna-count"]:checked');
    if (qnaOption.checked && (!count || !["1", "2", "3"].includes(count.value))) {
        qnaError.textContent = "여행 질문 수를 1개, 2개, 3개 중 선택해 주세요.";
        qnaOption.setAttribute("aria-invalid", "true");
        return false;
    }
    formData.duration = duration;
    formData.qna = qnaOption.checked;
    formData.qnaCount = qnaOption.checked ? count.value : "2";
    return true;
}

function updatePlanSummary() {
    summaryTitle.textContent = formData.title;
    summaryDuration.textContent = formData.duration + "분";
    summaryQna.textContent = formData.qna ? formData.qnaCount + "개 포함" : "미포함";
}

optionNext.addEventListener("click", () => {
    if (!validateTitle()) {
        showStep(0);
        titleInput.focus();
        return;
    }
    if (!readPlanOptions()) {
        planForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }
    updatePlanSummary();
    showStep(2);
});
summaryPrev.addEventListener("click", () => showStep(1));
planForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isSubmitting || submitState === "success") return;
    if (!validateTitle()) {
        showStep(0);
        setSubmitState("invalid");
        planForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }
    if (!readPlanOptions()) {
        showStep(1);
        setSubmitState("invalid");
        planForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }
    updatePlanSummary();
    if (currentStep !== 2) {
        showStep(2);
        planSubmitMessage.textContent = "내용을 확인한 뒤 '여행 준비 계획 제출하기'를 눌러 주세요.";
        finishButton.focus();
        return;
    }
    const data = new FormData(planForm);
    setSubmitState("loading");
    savePlan(data);
});

restartButton.addEventListener("click", () =>{
    formData.title = "";
    formData.duration = "5";
    formData.qna = false;
    formData.qnaCount = "2";
    titleInput.value = "";
    titleError.textContent = "";
    clearError();
    titleField.classList.remove("is-valid");
    updateTitleState();
    setSubmitState("idle");
    document.querySelector("#duration-error").textContent = "";
    document.querySelector("#qna-error").textContent = "";
    durationRange.removeAttribute("aria-invalid");
    qnaOption.removeAttribute("aria-invalid");
    durationRange.value = "1";
    durationValue.value = "5분";
    qnaOption.checked = false;
    syncQnaOptions();
    document.querySelector('input[name="qna-count"][value="2"]').checked = true;
    summaryTitle.textContent = "";
    summaryDuration.textContent = "";
    summaryQna.textContent= "";
    showStep(0);
    titleInput.focus();
});


// 중간고사 추가 기능: 완료한 여행 준비 계획을 목록에 저장하고 다시 열기
let completedPlan = null;
let savedPlans = [];
let nextPlanId = 1;
let openedPlanId = null;
let pendingDeleteId = null;
const savedList = document.querySelector("#saved-plan-list");
const savedDetail = document.querySelector("#saved-plan-detail");
const savedListMessage = document.querySelector("#saved-list-message");
const savePlanMessage = document.querySelector("#save-plan-message");
const deletePlanDialog = document.querySelector("#delete-plan-dialog");

function renderSavedPlans() {
    savedList.replaceChildren();
    document.querySelector("#saved-empty").hidden = savedPlans.length > 0;
    document.querySelector("#saved-count").textContent = "저장한 계획: " + savedPlans.length + "개";

    savedPlans.forEach(function(plan) {
        const item = document.createElement("li");
        item.className = "saved-plan-card";
        const title = document.createElement("h3");
        title.textContent = plan.title;
        const summary = document.createElement("p");
        summary.textContent = "준비 " + plan.duration + "분 · 여행 질문 " +
            (plan.qna ? plan.qnaCount + "개 포함" : "미포함");
        const actions = document.createElement("div");
        actions.className = "saved-plan-actions";
        const openButton = document.createElement("button");
        openButton.type = "button";
        openButton.textContent = "다시 열기";
        openButton.dataset.action = "open";
        openButton.dataset.planId = plan.id;
        openButton.setAttribute("aria-label", plan.title + " 계획 다시 열기");
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-plan-button";
        deleteButton.textContent = "삭제";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.planId = plan.id;
        deleteButton.setAttribute("aria-label", plan.title + " 계획 삭제");
        actions.append(openButton, deleteButton);
        item.append(title, summary, actions);
        savedList.append(item);
    });
}

document.querySelector("#save-plan-button").addEventListener("click", function() {
    if (!completedPlan || !completedPlan.title.trim()) {
        savePlanMessage.textContent = "먼저 여행 준비 설정을 완료해 주세요.";
        return;
    }
    const duplicate = savedPlans.some(function(plan) {
        return plan.title === completedPlan.title &&
            plan.duration === completedPlan.duration &&
            plan.qna === completedPlan.qna &&
            (!plan.qna || plan.qnaCount === completedPlan.qnaCount);
    });
    if (duplicate) {
        savePlanMessage.textContent = "같은 계획이 이미 저장되어 있습니다. 아래 목록에서 다시 열어 확인해 주세요.";
        return;
    }

    savedPlans.push({ ...completedPlan, id: nextPlanId++ });
    renderSavedPlans();
    savePlanMessage.textContent = "계획을 저장했습니다. '저장한 계획 목록 보기'를 눌러 다시 확인할 수 있습니다.";
    savedListMessage.textContent = completedPlan.title + " 계획을 목록에 추가했습니다.";
});

function focusListButton(id, action) {
    const button = savedList.querySelector('[data-action="' + action + '"][data-plan-id="' + id + '"]');
    if (button) button.focus();
    else document.querySelector("#saved-plans-title").focus();
}

savedList.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-plan-id]");
    if (!button) return;
    const plan = savedPlans.find(function(item) {
        return item.id === Number(button.dataset.planId);
    });
    if (!plan) {
        savedListMessage.textContent = "계획을 찾을 수 없습니다. 목록에서 다른 계획을 선택해 주세요.";
        return;
    }
    if (button.dataset.action === "open") {
        openedPlanId = plan.id;
        document.querySelector("#saved-detail-name").textContent = plan.title;
        document.querySelector("#saved-detail-duration").textContent = plan.duration + "분";
        document.querySelector("#saved-detail-qna").textContent = plan.qna ? plan.qnaCount + "개 포함" : "미포함";
        savedDetail.hidden = false;
        savedListMessage.textContent = plan.title + " 계획을 다시 열었습니다.";
        document.querySelector("#saved-detail-title").focus();
    } else if (button.dataset.action === "delete") {
        pendingDeleteId = plan.id;
        document.querySelector("#delete-plan-description").textContent =
            "'" + plan.title + "' 계획을 목록에서 삭제할까요? 삭제한 계획은 목록에서 다시 열 수 없습니다.";
        deletePlanDialog.showModal();
    }
});

document.querySelector("#close-saved-detail").addEventListener("click", function() {
    savedDetail.hidden = true;
    focusListButton(openedPlanId, "open");
    openedPlanId = null;
});

function cancelPlanDeletion() {
    const id = pendingDeleteId;
    deletePlanDialog.close();
    pendingDeleteId = null;
    savedListMessage.textContent = "삭제를 취소했습니다. 계획은 목록에 그대로 남아 있습니다.";
    focusListButton(id, "delete");
}
document.querySelector("#delete-plan-cancel").addEventListener("click", cancelPlanDeletion);
deletePlanDialog.addEventListener("cancel", function(event) {
    event.preventDefault();
    cancelPlanDeletion();
});
document.querySelector("#delete-plan-confirm").addEventListener("click", function() {
    const id = pendingDeleteId;
    const plan = savedPlans.find(function(item) { return item.id === id; });
    if (!plan) {
        deletePlanDialog.close();
        pendingDeleteId = null;
        savedListMessage.textContent = "삭제할 계획이 없습니다. 목록을 다시 확인해 주세요.";
        return;
    }
    savedPlans = savedPlans.filter(function(item) { return item.id !== id; });
    if (openedPlanId === id) {
        savedDetail.hidden = true;
        openedPlanId = null;
    }
    deletePlanDialog.close();
    pendingDeleteId = null;
    renderSavedPlans();
    savedListMessage.textContent = plan.title + " 계획을 삭제했습니다." +
        (savedPlans.length === 0 ? " 여행 준비 설정에서 새 계획을 만들어 저장해 주세요." : "");
    document.querySelector("#saved-plans-title").focus();
});
document.querySelector("#saved-plans-title").tabIndex = -1;
renderSavedPlans();

function setSubmitState(state) {
    submitState = state;
    isSubmitting = state === "loading";
    planForm.setAttribute("aria-busy", String(isSubmitting));
    startButton.disabled = isSubmitting || !agreeCheck.checked;
    agreeCheck.disabled = isSubmitting;
    planForm.dataset.submitState = state;
    planForm.querySelectorAll("input, button").forEach((control) => {
        control.disabled = isSubmitting;
    });
    syncQnaOptions();
    finishButton.disabled = isSubmitting || state === "success";
    finishButton.textContent = isSubmitting ? "저장 중…" :
        state === "error" ? "같은 내용으로 다시 시도하기" :
        state === "success" ? "제출 완료" : "여행 준비 계획 제출하기";
    const messages = {
        idle: "입력과 조건을 확인한 뒤 마지막 단계에서 제출해 주세요.",
        invalid: "입력한 내용을 확인해 주세요. 표시된 오류를 고친 뒤 계속할 수 있습니다.",
        loading: "여행 준비 계획을 이 브라우저에 저장하고 있습니다.",
        success: "여행 준비 계획 제출이 완료되었습니다. 목록에 추가하거나 다시 작성할 수 있습니다.",
        error: "브라우저 저장에 실패했습니다. 입력은 유지됩니다. 저장 공간이나 사이트 저장 권한을 확인한 뒤 다시 시도해 주세요."
    };
    planSubmitMessage.textContent = messages[state];
}
function savePlan(data) {
    const submittedPlan = {
        title: String(data.get("travelTitle")).trim(),
        duration: durationValues[data.get("duration")],
        qna: data.get("qna") === "included",
        qnaCount: data.has("qna-count") ? String(data.get("qna-count")) : "2"
    };
    setTimeout(() => {
        try {
           
            localStorage.setItem(submissionStorageKey, JSON.stringify(submittedPlan));
            completedPlan = { ...submittedPlan };
            showLastSubmission(submittedPlan);
            setSubmitState("success");
            document.querySelector("#save-plan-message").textContent = "완료한 계획을 현재 페이지의 목록에도 추가할 수 있습니다.";
            showStep(3);
            const heading = flowSteps[3].querySelector("h3");
            heading.tabIndex = -1;
            heading.focus();
        } catch (error) {
            setSubmitState("error");
            finishButton.focus();
        }
    }, 600);
}

function showLastSubmission(plan) {
    document.querySelector("#last-submission").hidden = false;
    document.querySelector("#last-submission-summary").textContent =
        plan.title + " · 준비 " + plan.duration + "분 · 여행 질문 " +
        (plan.qna ? plan.qnaCount + "개 포함" : "미포함");
}

function loadLastSubmission() {
    try {
        const raw = localStorage.getItem(submissionStorageKey);
        if (!raw) return;
        const plan = JSON.parse(raw);
        if (!plan || typeof plan.title !== "string" || plan.title.trim().length < 2 ||
            plan.title.length > 60 || !durationValues.includes(plan.duration) ||
            typeof plan.qna !== "boolean" ||
            (plan.qna && !["1", "2", "3"].includes(plan.qnaCount))) return;
        showLastSubmission(plan);
    } catch (error) {
    }
}
setSubmitState("idle");
loadLastSubmission();