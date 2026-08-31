package BillPayment.dto;

public class UserResponse {
    private Long id;
    private String username;
    private String fullname;
    private String userStatus;

    public UserResponse(Long id, String username, String fullname, String userStatus) {
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.userStatus = userStatus;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getFullname() { return fullname; }
    public String getUserStatus() { return userStatus; }
}