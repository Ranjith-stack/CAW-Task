import { Given,Then} from "cypress-cucumber-preprocessor/steps"

let m = new Map();
let maindata: { url: any, jsondata: any }


Given('Storing dataset {string}', (dataset) => {
    cy.readFile('cypress/fixtures/TestData/freshIQ2DotX/Demo.json').then((examples) => {
        for (var value in examples) {
            m.set(value, examples[value]);
        }
        maindata = m.get(dataset);
    })
})

Then('Navigate to URL', () => {
    cy.visit(maindata.url);
})

Then('Enter value on input field and click refresh tabel', () => {
    cy.xpath("//*[normalize-space(text())='Table Data']").click();
    let a = JSON.stringify(maindata.jsondata);
    cy.get("#jsondata").click().clear().type(a, { force: true, parseSpecialCharSequences: false });
    cy.get("#refreshtable").click();
})

Then('Validate data got updated in tabel', () => {
    let len: any
    cy.get("table[id='dynamictable']").find('tr').then((row) => {
        len = row.length - 1;
        const jsonLength = maindata.jsondata.reduce((a: any, obj: any) => a + Object.keys(obj).length, 0);
        cy.log("Array Len " + jsonLength);
        cy.log("Len " + len);
        expect(jsonLength / 3).equal(len);
        for (let i = 0; i < len; i++) {
            cy.xpath("//table[@id='dynamictable']//tr//td[text()='" + maindata.jsondata[i].name + "']//following-sibling::td[1]").
                should('have.text', maindata.jsondata[i].age);
            cy.xpath("//table[@id='dynamictable']//tr//td[text()='" + maindata.jsondata[i].name + "']//following-sibling::td[2]").
                should('have.text', maindata.jsondata[i].gender);
        }
    })
})