package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {

    @Autowired
    UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;


    @Test
    public void admin_user_can_create_edit_delete_restaurant() throws Exception {

        UCSBDiningCommonsMenuItem menuItem1 = UCSBDiningCommonsMenuItem.builder()
                                .diningCommonsCode("9")
                                .name("chips")
                                .station("junk")
                                .build();

        ucsbDiningCommonsMenuItemRepository.save(menuItem1);

        setupUser(true);
        
        page.getByText("Menu Items").click();

        assertThat(page.getByTestId("MenuItemTable-cell-row-0-col-name"))
                .hasText("chips");

        page.getByTestId("MenuItemTable-cell-row-0-col-Delete").click();
        
        assertThat(page.getByTestId("MenuItemTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menuItem() throws Exception {
        setupUser(false);

        page.getByText("Menu Item").click();

        assertThat(page.getByText("Create Menu Item")).not().isVisible();
    }
    @Test
    public void admin_user_can_see_create_menuItem() throws Exception {
        setupUser(true);

        page.getByText("Menu Item").click();

        assertThat(page.getByText("Create Menu Item")).isVisible();
    }
}