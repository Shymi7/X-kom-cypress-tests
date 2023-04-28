import exp from "constants";

let username = 'nieisteniejącyUser@testowy-x-kom.com';
let password = 'Has3Łko!';
const api_auth_key = "jfsTOgOL23CN2G8Y"



describe('TEST SCENARIO', () => {
   /**REVIEW:
    * ten console log powinien wyświetlać się tylko raz,
    */
   beforeEach(() => {
      console.log("przed testem")
   });

   /**REVIEW:
    * testy nie powinny znajdować się w jednej sekcji it()
    */
   it('TEST CASE 1', () => {

         /*

      Starting: Use Node 14.21.2
      Cypress": "^11.2.0",

      */

      /**REVIEW:
       * zmienne powinny być zamienione na stałe
       * niektóre wartości nie są używane
       * literówka
      **/
      let sku_of_product: number = 312323;
      let prductName1: string = 'ASUS [E2E-AT] R500VD-SX573H i3';
      let PrductPrice1 : number = 100
      let prductName2 : string= 'Samsung [E2E-AT] 500GB M.2 PCIe NVMe 970 EVO Plus';
      let PrductPrice2 : number = 100
      let PrductName3 : string = 'Kingston 64GB DataTraveler 100 G3';
      let PrductPrice3 : number = 100;

      let modalLayout: string = "[data-cy='add_to_basket_modal_layout']";


      /**REVIEW:
       * poszczególne kroki nie są / są źle ponumerowane
       * zbyt długi wait
       */
      cy.visit("https://www.fakesklepzadanierekrutacyjne.pl")
      cy.visit('https://www.fakesklepzadanierekrutacyjne.pl/logowanie');
      cy.wait(3000);

      // Sprawdzenie czy formularz logowania działa poprawnie

      //1. Podanie niepoprawnych danych
      cy.get('[data-cy="login_form"] input[name="login"]').type('password');
      cy.get('[data-cy="login_form"] input[name"password"]').type(username);
      cy.get('[data-cy="login_form"] button').contains('Zalguj').click();


      // Wyszukanie produktu, po nazwie, dodanie 3 różnych produktów do koszyka

      // 1 produkt

      /**REVIEW:
       * użyta jest niezdefiniowana funkcja fill()
       * być może chodziło o funkcję type()
       */

      cy.visit('https://www.fakesklepzadanierekrutacyjne.pl/');
      cy.get('[data-cy="search_bar_row_wrapper"] input')
         .clear()
         .click()
         .fill(`${prductName1}[enter]`);
      cy.get('[data-cy="listing_container_wrapper"]')
         .find("[data-cy='product_title']")
         .first()
         .click();
         cy.intercept(GET, "**/baskets").as("basket_response")
         cy.contains('Dodaj do koszyka').filter(':visible').wait(3000).click().should('be.visible');
         cy.wait('basket_response').then((resp) => expect(resp.response.statusCode).to.be.above(200))

      cy.get("[data-cy="add_to_basket_modal_layout"]").should('have.visibility');
      cy.contains(modalLayout, 'Wróć do zakupów').click;

      /**REVIEW:
       * kod jest mało czytelny, powinien być oddzielony pustymi liniami
       *
       */

      // 2gi produkt
      cy.visit('https://www.fakesklepzadanierekrutacyjne.pl');
      cy.get('[data-cy="search_bar_row_wrapper"] input')
         .clear()
         .click()
         .fill(`${prductName2}[enter]`);
      cy.get('[data-cy="listing_container_wrapper"]')
         .find("[data-cy='product_title']")
         .first()
         .click();
      cy.intercept(GET, "**/baskets").as("basket_response")
      cy.contains('Dodaj do koszyka').filter(':visible').wait(3000).click().should('be.visible');
      cy.wait('basket_response').then((resp) => expect(resp.response.statusCode).to.be.above(200))
      cy.get("[data-cy="add_to_basket_modal_layout"]").should('have.visibility');
      cy.contains(modalLayout, 'Wróć do zakupów').click;

      // 3gi produkt


      cy.visit('https://www.fakesklepzadanierekrutacyjne.pl');
      cy.get('[data-cy="search_bar_row_wrapper"] input')
         .clear()
         .click()
         .fill(`${PrductName3}[enter]`);
      cy.get('[data-cy="listing_container_wrapper"]')
         .find("[data-cy='product_title']")
         .first()
         .click();
         cy.intercept(GET, "**/baskets").as("basket_response")
         cy.contains('Dodaj do koszyka').filter(':visible').wait(3000).click().should('be.visible');
         cy.wait('basket_response').then((resp) => expect(resp.response.statusCode).to.be.above(200))
      cy.get("[data-cy="add_to_basket_modal_layout"]").should('have.visibility');
      cy.contains(modalLayout, 'Wróć do zakupów').click;

         //  //1 produkt
         // cy.visit('https://www.fakesklepzadanierekrutacyjne.pl');
         // cy.get('[data-cy="search_bar_row_wrapper"] input').type(sku_of_product).click()
         // cy.contains('Dodaj do koszyka').filter(':visible').wait(3000).click().should('be.visible');
         // cy.get("[data-cy="add_to_basket_modal_layout"]").should('have.visibility');
         // cy.contains(modalLayout, 'Wróć do zakupów').click;

      // spradzenie czy w koszyku jest odpowiednia ilość produktów

      /**REVIEW:
       * ilość produktów nie powinna być w osobnej zmiennej / stałej
       *
       */

      cy.open('https://www.fakesklepzadanierekrutacyjne.pl/koszyk');
      cy.get('[data-cy="basket_item"]').should('be.visible');
      cy.get('[data-cy="basket_item"]').should('have.count', 4);

      cy.contains('[data-cy="product_name"]').invoke('text').each(text => {cy.wrap(text).should('be.visible')})

      const arrayOfPrices = [PrductPrice1, PrductPrice2, PrductName3]
      arrayOfPrices.forEach((productPrice) => {
         cy.contains("cena").each((price) => {
            cy.wrap(price).invoke('text').should('contain', productPrice)
         })
      })

      // Usuwanie 2 produktów z koszyka (2 pierwszych z listy)
      /**REVIEW:
       * żadne produkty nie są usuwane
       */

      cy.get('[data-cy="basket_item"]').eq(1).filter("[data-cy=remove_button]").should('be.visible').click();
      cy.get('[data-cy="basket_item"]').eq(2).filter("[data-cy=remove_button]").should('be.visible').click();


      /**REVIEW:
       * test nie powinien weryfikować czy "kontynuuj jako gość" jest widoczny, tylko czy nie jest widoczny
       * selectory nie są dokładne i powinny zawierać np. data-cy lub buttony
       * get powinien mieć kolejne funkcje łańcuchowe, np .should()
       * ostatnia linijka powinna użyć cy.url()
       */
      // Weryfikacja ze mozna kontynuować jako gość, ale przejście do formularza założenia konta
      cy.contains("button", "Przejdź do dostawy").click()
      cy.contains("Kontynuj jako gość").should('not.be.visible')
      cy.get("[data-cy='Załóż konto']")
      cy.window().then((win) => cy.wrap(win.location.href)).should('contain', 'https://www.fakesklepzadanierekrutacyjne.pl\rejestracja')
   });
});
