package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.MenuItemReview;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)




public class MenuItemReviewWebIT extends WebTestCase {
    @Autowired
    MenuItemReviewRepository menuItemReviewRepository;

    @Test
    public void admin_user_can_create_edit_delete_menuItemReview() throws Exception {
        setupUser(true);

        
        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
        MenuItemReview menuItemReview = MenuItemReview.builder()
                                .itemId(0)
                                .reviewerEmail("Test@imaginary.com")
                                .stars(4)
                                .dateReviewed(ldt1)
                                .comments("worked great")
                                .build();  
                                
        menuItemReviewRepository.save(menuItemReview);

        page.getByText("Menu Item Reviews").click();


        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail"))
                .hasText("Test@imaginary.com");
    
        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit").click();
        assertThat(page.getByText("Edit MenuItemReview")).isVisible();
        page.getByTestId("MenuItemReviewForm-comments").fill("worked bad");
        page.getByText("Update").click(); 

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("worked bad");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menuItemReview() throws Exception {
        setupUser(false);

        page.getByText("Menu Item Reviews").click();

        assertThat(page.getByText("Create MenuItemReview")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).not().isVisible();
    }

    @Test
    public void admin_user_can_create_menuItemReview() throws Exception {
        setupUser(true);

        page.getByText("Menu Item Review").click();

        assertThat(page.getByText("Create MenuItemReview")).isVisible();
    }
}