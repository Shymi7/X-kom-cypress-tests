context('Order', () => {
    let productName;
    let productPrice;
    const productQuantity = 2;


    before(() => {
        cy.clearCookies();
    })

    it('Open x-kom main page', () => {
        cy.visit("https://www.x-kom.pl");

        //x-kom logo is visible
        cy.get('.sc-1tblmgq-1.fIFmvE')
            .should('be.visible');
    });


    it('Display rodo prompt', () => {
        cy.wait(500);

        cy.get('.modal')
            .should('be.visible');
    });


    it('Accept rodo prompt', () => {
        cy.wait(500);

        //click button
        cy.contains('button', 'W porządku')
            .click();

        //check if modal is not visible
        cy.get('.modal')
            .should('not.be.visible');

        cy.wait(500);



        //check if cookies are set
        cy.getCookie('trackingPermissionConsentsValue').then((cookie) => {
            const decodedValue = decodeURIComponent(cookie.value);
            const parsedValue = JSON.parse(decodedValue);

            expect(parsedValue.cookies_analytics).to.be.true;
            expect(parsedValue.cookies_personalization).to.be.true;
            expect(parsedValue.cookies_advertisement).to.be.true;
        });
    })


    it('Click first product', () => {
        cy.wait(500);

        cy.get('.sc-16zrtke-0.kGLNun.sc-30n28d-10.yyhXD')
            .first()
            .children('span')
            .invoke('text')
            .then(text => {
                productName = text;
            })

        cy.get('.sc-15ih3hi-0.sc-1j3ie3s-1.iGsnKy')
            .first()
            .click({force: true});

        cy.get('.modal')
            .contains('Produkt dodany do koszyka')
            .should('be.visible');
    })

    it('Click "Przejdź do koszyka" button', () => {
        //cy.wait(2500)
        cy.once('uncaught:exception', () => false);

        //click button
        cy.get('.modal')
            .contains('a', 'Przejdź do koszyka')
            .click();

        //check if url contains "/koszyk"
        cy.url()
            .should('include', '/koszyk')
    })

    it('Verify content of cart', () => {
        cy.get('.sc-160wg4d-12.jTgJzw')
            .invoke('text')
            .should('equal', productName);
    })


    it('Click number of items to buy dropdown', () => {
        cy.get('.Select-control')
            .click();

    })

    it('Select 2 items', () => {
        cy.get('#react-select-id1--option-1')
            .click();

        //check if label appeared
        cy.get('span')
            .contains('Liczba produktów zmieniona.')
            .should('be.visible');

        //check if two products are selected
        cy.get('.Select-value-label')
            .should('to.be', '2');


        cy.get('.sc-6n68ef-0.sc-6n68ef-3.grmHu')
            .invoke('text')
            .then(text => {
                productPrice = parseCurrency(text);
            })

        cy.get('.sc-pvj85d-3.iSxvSJ')
            .invoke('text')
            .then(text => {
                expect(parseCurrency(text))
                    .to.approximately(productPrice * 2, 0.01);
            })
    })

    it('Click "Przejdź do dostawy" button', () => {
        cy.wait(500);

        cy.get('button')
            .contains('Przejdź do dostawy')
            .click();

        //check if url contains "/dostawa"
        cy.url()
            .should('include', '/zamowienie/logowanie-lub-rejestracja')
    })

    it('Click "Kontynuuj jako gość" button', () => {
        cy.wait(500);

        //click button
        cy.get('button')
            .contains('Kontynuuj jako gość')
            .click();

        //check if url contains "/dostawa"
        cy.url()
            .should('include', '/zamowienie')

    //     cy.wait(500);
    //
    //     //its probably necessary to continue tests, although it's not a good practice
    //     cy.once('uncaught:exception', () => false);
    //
    //
    //     //check if product name is correct
    //     cy.get('.sc-1riiuyq-5.cKqnb')
    //         .invoke('text')
    //         .then(text => {
    //             expect(text)
    //                 .to.equal(productName)
    //         });
    //
    //     //check if product price is correct
    //     cy.get('.sc-6n68ef-0.sc-6n68ef-3.grmHu')
    //         .invoke('text')
    //         .then(text => {
    //             expect(parseCurrency(text))
    //                 .to.approximately(productPrice * 2, 0.01);
    //         });
    //
    //     //check if product quantity is correct
    //     cy.get('.sc-1riiuyq-3.ijvGMo')
    //         .invoke('text')
    //         .then(text => {
    //             expect(text.split(' ')[0])
    //                 .to.equal(productQuantity.toString());
    //         });
    //
    })


    it('Click "kurier" option', () => {
        cy.get('label')
            .contains('kurier')
            .children('input')
            .click();
    })

})





function parseCurrency(str) {
    // Remove any non-numeric characters from the string
    str = str.replace(/[^\d,.-]/g, '');

    // Replace commas with periods and convert to number
    return parseFloat(str.replace(',', '.'));
}
