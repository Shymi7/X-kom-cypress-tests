context('Gorący strzał', () => {

    //parameters
    let isGsActive = true;
    let time;
    let button;



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
    });

    it('Display GS banner', () => {
        cy.get('#hotShot')
            .should('be.visible');
    })


    it('Has name, discount price and time left/to next hot shot',  () => {
        //in case of GS is active
        if(isGsActive){
            //check discount price
            cy.get('#hotShot')
                .get('p')
                .contains('zł')
                .first()
                .should('be.visible');

            //check name
            cy.get('.sc-m80syu-0.kyAylJ.sc-1bb6kqq-10.iNZDqh')
                .children('span')
                .should('be.visible');

            //check time
            cy.get('.sc-ntliq5-0.hHFotc.sc-1bb6kqq-12.UndGZ')
                .children('span')
                .contains('Śpiesz się, oferta kończy się za:')
                .should('be.visible');
        }

        //in case of GS is not active
        else{



        }


    });

    it('Click on GS product', () => {
        if(isGsActive){
            cy.get('a[href="/goracy_strzal"]')
                .first()
                .click({force: true});

            cy.url()
                .should('include', '/goracy_strzal');


        }

        else{

        }
    });


    it('Check button in buy box', () => {
        if (isGsActive) {
            cy.get('button[title="Dodaj do koszyka"]')
                .should('be.visible');
        }

        else {

        }
    });

});
