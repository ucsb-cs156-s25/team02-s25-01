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
import java.time.LocalDateTime;
import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {

    @Autowired
    HelpRequestRepository helpRequestRepository;

    @Test
    public void admin_user_can_create_edit_delete_helprequest() throws Exception {
        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
        HelpRequest helprequest = HelpRequest.builder()
            .requesterEmail("hjin133@ucsb.edu")
            .teamId("01")
            .tableOrBreakoutRoom("table1")
            .requestTime(ldt1)
            .explanation("Can-i-get-a-help?")
            .solved(true)
            .build();
        helpRequestRepository.save(helprequest);
        setupUser(true);

        page.getByText("Help Request").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("hjin133@ucsb.edu");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).hasText("hjin133@ucsb.edu");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelRequestTable-cell-row-0-col-name")).not().isVisible();
        assertThat(page.getByTestId("HelRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_helpRequest() throws Exception {
        setupUser(false);
        page.getByText("Help Request").click();

        assertThat(page.getByText("Create HelpRequest")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void admin_user_can_see_create_helpRequest_botton() throws Exception {
        setupUser(true);

        page.getByText("Help Request").click();

        assertThat(page.getByText("Create HelpRequest")).isVisible();
    }
}