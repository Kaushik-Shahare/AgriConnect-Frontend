import { Card, CardContent, Typography, Grid } from "@mui/material";

interface SellerDetailsProps {
  seller: {
    email: string;
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
}

export const SellerDetailsCard: React.FC<SellerDetailsProps> = ({ seller }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Seller Details
        </Typography>
        <Grid container spacing={2}>
          {/* Name */}
          {seller.name && (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                <strong>Name:</strong> {seller.name}
              </Typography>
            </Grid>
          )}

          {/* Email */}
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              <strong>Email:</strong> {seller.email}
            </Typography>
          </Grid>
          {/* Phone */}
          {seller.phone && (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                <strong>Phone:</strong> {seller.phone}
              </Typography>
            </Grid>
          )}
          {/* Address */}
          {seller.address && (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                <strong>Address:</strong> {seller.address}
              </Typography>
            </Grid>
          )}
          {/* City, State, Country, Zip */}
          {(seller.city || seller.state || seller.country || seller.zip) && (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                <strong>Location:</strong>{" "}
                {[seller.city, seller.state, seller.country, seller.zip]
                  .filter(Boolean)
                  .join(", ")}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
