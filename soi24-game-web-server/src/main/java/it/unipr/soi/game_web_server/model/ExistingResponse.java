package it.unipr.soi.game_web_server.model;

public class ExistingResponse {
	
    private boolean exists;

    public ExistingResponse() {
    	this.exists = false;
    }

    public boolean getExists() {
    	return this.exists;
    }
    
    public void setExists(boolean exists) {
    	this.exists = exists;
    }
    
    public ExistingResponse exists(boolean exists) {
    	this.setExists(exists);
    	return this;
    }
}
