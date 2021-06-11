let addLogging = false,
    tweaked = false,
    cm,
    strCode;

const storeDefExtPR = {
        "View-def": "siebel/viewpr",
        "View-ext": "ViewPR",
        "DesktopList-def": "siebel/jqgridrenderer",
        "DesktopList-ext": "JQGridRenderer",
        "DesktopTree-def": "siebel/treeappletphyrenderer",
        "DesktopTree-ext": "TreeAppletPR",
        "DesktopForm-def": "siebel/phyrenderer",
        "DesktopForm-ext": "PhysicalRenderer"
    },
    storeDefExtPM = {
        "View-def": "siebel/viewpm",
        "View-ext": "ViewPM",
        "DesktopList-def": "siebel/listpmodel",
        "DesktopList-ext": "ListPresentationModel",
        "DesktopTree-def": "siebel/explorerpmodel",
        "DesktopTree-ext": "ExplorerPresentationModel",
        "DesktopForm-def": "siebel/pmodel",
        "DesktopForm-ext": "PresentationModel"
    };

$("#Object").on("change", function() {
    GenerateCode();
});
$("#PRPM").on("change", function() {
    $(this).val() === "PM"
        ? $(".pm-methods-form").show()
        : $(".pm-methods-form").hide();
    GenerateCode();
});
$("#Namer").on("keyup", function() {
    GenerateCode();
});
$("#UserProps").on("keyup", function() {
    GenerateCode();
});
$("input:radio[name=Logging]").click(function() {
    addLogging = $(this).val() == "Yes";
    GenerateCode();
});

$(".pm-method-cb").on("change", function() {
    GenerateCode();
});

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
    SetDefaultValues();
    GenerateCode();
});

function addCode(line) {
    return line + "\n";
}

function addPRLog(line, indent) {
    return addLogging ? `SiebelJS.Log(\`[TemplatePR]: ${line}\`);\n` : "";
}

function addPMLog(line, indent) {
    return addLogging ? `SiebelJS.Log(\`[TemplatePM]: ${line}\`);\n` : "";
}

function GenerateCode() {
    strCode = "";
    const userProps = $("#UserProps")
        .val()
        .split(",");

    const IM = $("input#IM").prop("checked"),
        PE = $("input#PE").prop("checked"),
        SS = $("input#SS").prop("checked"),
        FC = $("input#FC").prop("checked");

    switch ($("#PRPM").val()) {
        case "PR":
            strCode += addCode(
                `if (typeof(SiebelAppFacade.TemplatePR) === "undefined") {`
            );
            strCode += addCode(
                `SiebelJS.Namespace("SiebelAppFacade.TemplatePR");`
            );
            strCode += addCode(
                `define("siebel/custom/TemplatePR", ["${
                    storeDefExtPR[$("#Object").val() + "-def"]
                }"], function () {`
            );
            strCode += addCode(`SiebelAppFacade.TemplatePR = (function () {`);
            strCode += addCode("");
            strCode += addCode(`function TemplatePR(pm) {`);
            strCode += addCode(
                `SiebelAppFacade.TemplatePR.superclass.constructor.apply(this, arguments);`
            );
            strCode += addCode(`}`);
            strCode += addCode("");
            strCode += addCode(
                `SiebelJS.Extend(TemplatePR, SiebelAppFacade.${
                    storeDefExtPR[$("#Object").val() + "-ext"]
                });`
            );
            strCode += addCode("");
            strCode += addCode(`TemplatePR.prototype.Init = function () {`);
            strCode += addCode(
                `SiebelAppFacade.TemplatePR.superclass.Init.apply(this, arguments);`
            );
            strCode += addPRLog("Init method reached.");
            strCode += addCode(`}`);
            strCode += addCode("");
            strCode += addCode(`TemplatePR.prototype.ShowUI = function () {`);
            strCode += addPRLog("ShowUI method reached.");
            strCode += addCode(
                `SiebelAppFacade.TemplatePR.superclass.ShowUI.apply(this, arguments);`
            );
            if (userProps.length > 0) {
                for (prop in userProps) {
                    if (userProps[prop] !== "") {
                        strCode += addPRLog(
                            `User Property ${
                                userProps[prop]
                            } has value: \${this.GetPM().Get("${
                                userProps[prop]
                            }")}`
                        );
                    }
                }
            }
            strCode += addCode(`}`);
            strCode += addCode("");
            strCode += addCode(
                `TemplatePR.prototype.BindData = function (bRefresh) {`
            );
            strCode += addPRLog("BindData method reached.");
            strCode += addCode(
                `SiebelAppFacade.TemplatePR.superclass.BindData.apply(this, arguments);`
            );
            strCode += addCode(`}`);
            strCode += addCode("");
            strCode += addCode(
                `TemplatePR.prototype.BindEvents = function () {`
            );
            strCode += addPRLog("BindEvents method reached.");
            strCode += addCode(
                `SiebelAppFacade.TemplatePR.superclass.BindEvents.apply(this, arguments);`
            );
            strCode += addCode(`}`);
            strCode += addCode("");
            strCode += addCode(`TemplatePR.prototype.EndLife = function () {`);
            strCode += addPRLog("EndLife method reached.");
            strCode += addCode(
                `SiebelAppFacade.TemplatePR.superclass.EndLife.apply(this, arguments);`
            );
            strCode += addCode(`}`);
            strCode += addCode("");
            strCode += addCode(`return TemplatePR;`);
            strCode += addCode(`}());`);
            strCode += addCode(`return "SiebelAppFacade.TemplatePR";`);
            strCode += addCode(`})`);
            strCode += addCode("}");
            break;
        case "PM":
            strCode += addCode(
                'if (typeof(SiebelAppFacade.TemplatePM) === "undefined") {'
            );
            strCode += addCode(
                'SiebelJS.Namespace("SiebelAppFacade.TemplatePM");'
            );
            strCode += addCode(
                `define("siebel/custom/TemplatePM", ["${
                    storeDefExtPM[$("#Object").val() + "-def"]
                }"], function () {`
            );
            strCode += addCode("SiebelAppFacade.TemplatePM = (function () {");
            if (userProps.length > 0 && $("#UserProps").val() !== "") {
                strCode += addCode("");
                strCode += addCode(
                    'var consts = SiebelJS.Dependency("SiebelApp.Constants");'
                );
                strCode += addCode(
                    'var utils = SiebelJS.Dependency("SiebelApp.Utils");'
                );
            }
            strCode += addCode("");
            strCode += addCode("function TemplatePM(pm) {");
            strCode += addCode(
                "SiebelAppFacade.TemplatePM.superclass.constructor.apply(this, arguments);"
            );
            strCode += addCode("}");
            strCode += addCode("");
            strCode += addCode(
                `SiebelJS.Extend(TemplatePM, SiebelAppFacade. ${
                    storeDefExtPM[$("#Object").val() + "-ext"]
                });`
            );
            strCode += addCode("");
            strCode += addCode("TemplatePM.prototype.Init = function () {");
            strCode += addCode(
                "SiebelAppFacade.TemplatePM.superclass.Init.apply(this, arguments);"
            );
            if (IM) {
                strCode += addCode(
                    `this.AddMethod("InvokeMethod", this.PreInvokeMethod, {sequence : true, scope: this});`
                );
            }
            if (PE) {
                strCode += addCode(
                    `this.AddMethod("PostExecute", this.PostExecute, { sequence: true, scope: this});`
                );
            }
            if (SS) {
                strCode += addCode(
                    `this.AddMethod('ShowSelection', this.SelectionChanged, {sequence: false, scope: this});`
                );
            }
            if (FC) {
                strCode += addCode(
                    `this.AddMethod("FieldChange", this.OnFieldChange, {sequence:false, scope:this});`
                );
            }
            strCode += addPMLog("Init method reached.");
            strCode += addCode("}");
            strCode += addCode("");
            if (IM) {
                strCode += addCode(
                    "TemplatePM.prototype.PreInvokeMethod = function(methodName, psInArgs, lp, returnStructure)"
                );
                strCode += addCode("{");
                strCode += addCode('const customMethods = ["YourMethod"];');
                strCode += addCode("");
                strCode += addCode("switch (methodName)");
                strCode += addCode("{");
                strCode += addCode('case "YourMethod":\n//your code\nbreak;');
                strCode += addCode("}\n");
                strCode += addCode('if (customMethods.includes(methodName)) {');
                strCode += addCode('returnStructure["CancelOperation"] = true;');
                strCode += addCode("SiebelApp.S_App.uiStatus.Free(); }");
                strCode += addCode("}");
                strCode += addCode("");
            }
            if (PE) {
                strCode += addCode(
                    `TemplatePM.prototype.PostExecute = function(methodName, psIn, psOut) {`
                );
                strCode += addCode("// your code");
                strCode += addCode("}\n");
            }
            if (SS) {
                strCode += addCode(
                    "TemplatePM.prototype.SelectionChanged = function() {"
                );
                strCode += addCode("// your code");
                strCode += addCode("}\n");
            }
            if (FC) {
                strCode += addCode(
                    `TemplatePM.prototype.OnFieldChange = function(control, value) {`
                );
                strCode += addCode(`// your code`);
                strCode += addCode("}\n");
            }
            strCode += addCode(
                "TemplatePM.prototype.Setup = function (propSet) {"
            );
            strCode += addPMLog("Setup method reached.");
            strCode += addCode(
                "SiebelAppFacade.TemplatePR.superclass.Setup.apply(this, arguments);"
            );
            if (userProps.length > 0) {
                for (prop in userProps) {
                    if (userProps[prop] != "") {
                        strCode += addCode(
                            'processCustomUserProperty.call(this,propSet,"' +
                                userProps[prop] +
                                '")'
                        );
                    }
                }
            }
            strCode += addCode("}");
            if (userProps.length > 0) {
                var done = false;
                for (prop in userProps) {
                    if (userProps[prop] != "" && !done) {
                        strCode += addCode("");
                        strCode += addCode(
                            "function processCustomUserProperty(propSet,propertyName) {"
                        );
                        if ($("#Object").val() == "View")
                            strCode += addCode(
                                'var userProps = propSet.GetChildByType(consts.get("SWE_VIEW_PM_PS"));'
                            );
                        else {
                            strCode += addCode(
                                'var userProps = propSet.GetChildByType(consts.get("SWE_APPLET_PM_PS"));'
                            );
                            strCode += addCode("if (userProps) {");
                            strCode += addCode(
                                "var propVal = userProps.GetProperty(propertyName);"
                            );
                            strCode += addCode(
                                "if (!utils.IsEmpty(propVal)) {"
                            );
                            strCode += addCode(
                                "this.AddProperty(propertyName, propVal);"
                            );
                            strCode += addPMLog(
                                '"+propertyName+" user property was retrieved with value " + propVal +".'
                            );
                            strCode += addCode("}} else {");
                            strCode += addPMLog(
                                'Could not get the value of the "+propertyName+" user property.'
                            );
                            strCode += addCode("}");
                            strCode += addCode("}");
                            done = true;
                        }
                    }
                }
            }
            strCode += addCode("");
            strCode += addCode("return TemplatePM;");
            strCode += addCode("}()");
            strCode += addCode(");");
            strCode += addCode('return "SiebelAppFacade.TemplatePM";');
            strCode += addCode("})");
            strCode += addCode("}");
            break;
    }

    strCode = strCode.replace(
        /TemplatePR/g,
        $("#Namer").val() + $("#PRPM").val()
    );
    strCode = strCode.replace(
        /TemplatePM/g,
        $("#Namer").val() + $("#PRPM").val()
    );
    strCode = js_beautify(strCode, { brace_style: "expand,preserve-inline" });

    $("#instruction").html(
        "Copy and save the code below in your custom folder and call it <code>" +
            $("#Namer").val() +
            $("#PRPM").val() +
            ".js</code>. Get the <strong>cASe</strong> right, it's important."
    );

    if (
        userProps.length > 0 &&
        $("#PRPM").val() === "PR" &&
        $("#UserProps").val() !== ""
    ) {
        $("#instruction").append(
            "<br/><mark>NOTE</mark>:To use custom user properties you will also need a custom PM."
        );
    }

    $("#code").text(strCode);

    $(".code").each(function() {
        var $this = $(this),
            $code = $this.html(),
            $unescaped = $("<div/>")
                .html($code)
                .text();
        $this.empty();
        CodeMirror(this, {
            value: $unescaped,
            mode: "javascript",
            lineNumbers: !$this.is(".inline"),
            readOnly: true
        });
    });
}

function SetDefaultValues() {
    $("#PRPM").val("PR");
    $(".pm-methods-form").hide();
    $("#Namer").val("BeautifulThing");
    $("#Object").val("DesktopList");
    $("#UserProps").val("");
}
