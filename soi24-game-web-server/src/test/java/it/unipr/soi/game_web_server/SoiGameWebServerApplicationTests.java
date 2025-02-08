package it.unipr.soi.game_web_server;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

@SpringBootTest
class SoiGameWebServerApplicationTests {

	@Test
	void contextLoads() {
		final String[] args = new String[] {};
		final ApplicationContext appCtx = SoiGameWebServerApplication.start(args);
		assertNotNull(appCtx, "appCtx");
		SoiGameWebServerApplication.close();
	}
	
}
