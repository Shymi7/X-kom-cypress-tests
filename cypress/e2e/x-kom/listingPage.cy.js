context('ListingPage', () => {
    const category = 'Smartfony i smartwatche';
    const subcategory = 'Smartfony i telefony';

    let QuantityOfItems;



    before(() => {
        cy.clearCookies();
    })

    it('Open x-kom main page', () => {
        cy.visit("https://www.x-kom.pl");

        //check if x-kom logo is visible
        cy.get('[title="x-kom.pl"]')
            .should('be.visible');
    });

    it('Display rodo prompt', () => {

        cy.get('.modal')
            .contains('Dostosowujemy się do Ciebie')
            .should('be.visible');
    });


    it('Accept rodo prompt', () => {
        cy.wait(500);

        //click button
        cy.contains('button', 'W porządku')
            .click();

        //check if modal is not visible
        cy.get('.modal')
            .contains('Dostosowujemy się do Ciebie')
            .should('not.be.visible');


        //check if cookies are set
        cy.getCookie('trackingPermissionConsentsValue').then((cookie) => {
            const decodedValue = decodeURIComponent(cookie.value);
            const parsedValue = JSON.parse(decodedValue);

            expect(parsedValue.cookies_analytics).to.be.true;
            expect(parsedValue.cookies_personalization).to.be.true;
            expect(parsedValue.cookies_advertisement).to.be.true;
        });
    })


    it('Choose category from top bar', () => {

        //I couldn't find any non-class selector
        cy.get('.sc-13hctwf-5.bdvNWx')
            .contains(category)
            .click();

        //check if category is selected
        cy.url()
            .should(
                'include',
                category.replace(/ /g, '-').toLowerCase()
            );
    });

    it('Choose subcategory', () => {
        cy.get('.sc-1h16fat-0.sc-16n31g-3.kQMduO')
            .contains(subcategory)
            .click();

        //check if subcategory is selected
        cy.url()
            .should(
                'include',
                subcategory.replace(/ /g, '-').toLowerCase()
            );

        //check if subcategory is displayed
        cy.get('.sc-dntoh-2.vLfrh')
            .invoke('text')
            .should('equal', subcategory);
    });

    it('Click at first product', () => {
        //save product's name
        cy.get('.sc-16zrtke-0.kGLNun.sc-1yu46qn-9.feSnpB')
            .first()
            .children('span')
            .invoke('text')
            .then(text => {
                let productName = text;

                //click first product on the page
                cy.get('.sc-1h16fat-0.sc-1yu46qn-7.bCpqs')
                    .first()
                    .click();

                //check if product's name matches saved one
                cy.get('.sc-1bker4h-4.hMQkuz')
                    .invoke('text')
                    .should('equal', productName);
            });
    });

    it('Come back to listing page', () => {
        cy.go('back');

        //check url
        cy.url()
            .should(
                'include',
                subcategory.replace(/ /g, '-').toLowerCase()
            );

        //check if listing is visible
        cy.get('.sc-1s1zksu-0.sc-1s1zksu-1.hHQkLn.sc-162ysh3-0.gcopnL')
            .should('be.visible');
    });

    it('Click right pagination arrow', () => {
        cy.get('.sc-1h16fat-0.dNrrmO.sc-11oikyw-3.fWowUI')
            .first()
            .click();

        //check url
        cy.url()
            .should('include', 'page=2');

        //check if top of listing is visible
        cy.get('.sc-1s1zksu-0.sc-1s1zksu-1.hHQkLn.sc-162ysh3-0.gcopnL')
            .children()
            .first()
            .should('be.visible');
    });

    it('Choose producent filter', () => {
        //check first brand filter
        cy.get('.sc-1mqx5n1-0.dgCjFE.sc-1n7ydz7-3.gizGZI')
            .children('.sc-cs8ibv-0.izfzaG')
            .first()
            .children()
            .children('label')
            .children('input')
            .check({force: true});

        //set quantity of items before applying filter
        cy.get('.sc-dntoh-3.kTsXsi')
            .invoke('text')
            .then(text => {
                //extract number from string
                QuantityOfItems = parseInt(text.match(/\d+/)[0]);
            });

        //apply brand filter
        cy.get('.sc-3qnozx-5.cTHYmg')
            .first()
            .invoke('text')
            .wait(1000)
            .then(brand => {

                //check if quantity of items is reduced
                cy.get('.sc-dntoh-3.kTsXsi')
                    .invoke('text')
                    .then(text => {
                        expect(parseInt(text.match(/\d+/)[0]))
                            .to.be.lessThan(QuantityOfItems);
                    });

                //check if only items of selected brand are visible
                cy.get('.sc-16zrtke-0.kGLNun.sc-1yu46qn-9.feSnpB')
                    .each(($el) => {
                        expect($el.children('span').text())
                            .to.contain(brand.split(' ')[0]);
                    })
            });
    });

    it('Clear filters', () => {
        cy.get('button')
            .contains('Wyczyść wszystkie')
            .click()
            .wait(500);


        //check if quantity of items is equal to initial quantity
        cy.get('.sc-dntoh-3.kTsXsi')
            .invoke('text')
            .then(text => {
                expect(parseInt(text.match(/\d+/)[0]))
                    .to.equal(QuantityOfItems);
            });
    });


});
